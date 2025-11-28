import { NextResponse } from "next/server"
import { db } from "../../../modules/shared/util/db" // Adjust your path
import { z } from "zod"
import { Prisma } from "@prisma/client"

// ==========================================
// 1. VALIDATION SCHEMAS (Shared)
// ==========================================

// Schema for a single item row from frontend
// Remember: Send 1 Object per 1 Physical Item (if tracking IMEI)
const InventoryItemSchema = z.object({
  sku: z.string().min(1),
  quantity: z.number().int().positive().default(1),
  price: z.number().min(0),
  imeiCode: z.string().optional(),
})

const CreateInventorySchema = z.object({
  supplier: z.string().min(1),
  createdById: z.string().min(1),
  status: z.enum(["DRAFT", "COMPLETED", "CANCELLED"]).default("DRAFT"),
  items: z.array(InventoryItemSchema).optional(),
})

// ==========================================
// 2. GET METHOD (Fetch List)
// ==========================================
export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const { searchParams } = url

    // Filters
    const status = searchParams.get("status")
    const supplier = searchParams.get("supplier")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    // Pagination
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // Build Where Clause
    const whereClause: Prisma.ProductInventoryHeaderWhereInput = {
      ...(status && { status }),
      ...(supplier && {
        supplier: { contains: supplier, mode: "insensitive" },
      }),
      ...(startDate &&
        endDate && {
          createdDate: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }),
    }

    // Execute Transaction (Count + Data)
    const [total, inventoryHeaders] = await db.$transaction([
      db.productInventoryHeader.count({ where: whereClause }),
      db.productInventoryHeader.findMany({
        where: whereClause,
        take: limit,
        skip: skip,
        include: {
          productInventoryDetails: {
            include: {
              product: { select: { productName: true, brand: true } },
            },
          },
          createdBy: { select: { username: true } },
        },
        orderBy: { createdDate: "desc" },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: inventoryHeaders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching inventory:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch inventory" },
      { status: 500 }
    )
  }
}

// ==========================================
// 3. POST METHOD (Create & Stock Update)
// ==========================================
export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validate Input
    const validation = CreateInventorySchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.format() },
        { status: 400 }
      )
    }

    const { supplier, createdById, status, items } = validation.data

    // ================================
    // 1. CHECK SKU EXISTENCE
    // ================================
    if (items && items.length > 0) {
      const requestSkus = items.map((i) => i.sku)

      const products = await db.product.findMany({
        where: { sku: { in: requestSkus } },
        select: { sku: true },
      })

      const existingSkuSet = new Set(products.map((p) => p.sku))

      // Find missing SKUs
      const missingSkus = requestSkus.filter((sku) => !existingSkuSet.has(sku))

      if (missingSkus.length > 0) {
        return NextResponse.json(
          {
            success: false,
            error: `SKU not registered: ${missingSkus.join(", ")}`,
          },
          { status: 400 }
        )
      }
    }

    // ================================
    // 2. CALCULATE TOTAL
    // ================================
    const totalAmount = items
      ? items.reduce((sum, item) => sum + item.quantity * item.price, 0)
      : 0

    // ================================
    // 3. START TRANSACTION
    // ================================
    const result = await db.$transaction(async (tx) => {
      // A. Create Header + Details
      const header = await tx.productInventoryHeader.create({
        data: {
          supplier,
          createdById,
          status,
          totalAmount,
          productInventoryDetails: items
            ? {
                create: items.map((item) => ({
                  sku: item.sku,
                  quantity: item.quantity,
                  price: item.price,
                  imeiCode: item.imeiCode || null,
                })),
              }
            : undefined,
        },
        include: { productInventoryDetails: true },
      })

      // B. Update Stock only if COMPLETED
      if (status === "COMPLETED" && items && items.length > 0) {
        const skuUpdates = new Map<string, number>()

        for (const item of items) {
          const currentQty = skuUpdates.get(item.sku) || 0
          skuUpdates.set(item.sku, currentQty + item.quantity)

          // IMEI handling
          if (item.imeiCode) {
            await tx.imei
              .create({
                data: {
                  imei: item.imeiCode,
                  sku: item.sku,
                  isSold: false,
                },
              })
              .catch(() => {
                throw new Error(`Duplicate IMEI detected: ${item.imeiCode}`)
              })
          }
        }

        // Update Product Stock for each SKU
        for (const [sku, qty] of skuUpdates.entries()) {
          await tx.product.update({
            where: { sku },
            data: { quantity: { increment: qty } },
          })
        }
      }

      return header
    })

    return NextResponse.json({ success: true, data: result })
  } catch (error: any) {
    console.error("Error creating inventory:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process inventory" },
      { status: 500 }
    )
  }
}
