import { NextRequest, NextResponse } from "next/server"
import { db } from "../../../modules/shared/util/db"
import { z } from "zod"
import { Prisma } from "@prisma/client"
import { verifyJwt } from "@/src/modules/shared/util/auth"
import { cookies } from "next/headers"

const InventoryItemSchema = z.object({
  sku: z.string().min(1),
  quantity: z.number().int().positive().default(1),
  price: z.number().min(0),
  imeiCode: z.string().optional(),
})

const CreateInventorySchema = z.object({
  supplier: z.string().min(1),
  status: z.enum(["DRAFT", "COMPLETED", "CANCELLED"]).default("DRAFT"),
  items: z.array(InventoryItemSchema).optional(),
})

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const { searchParams } = url

    const status = searchParams.get("status")
    const supplier = searchParams.get("supplier")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

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

    const [total, inventoryHeaders] = await db.$transaction([
      db.productInventoryHeader.count({ where: whereClause }),
      db.productInventoryHeader.findMany({
        where: whereClause,
        take: limit,
        skip: skip,
        include: {
          productInventoryDetails: {
            include: {
              Product: { select: { productName: true, brand: true } },
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

export async function POST(req: NextRequest) {
  try {
    // Get userId from header (set by middleware)

    // Get token from cookies and verify
    const cookieStore = cookies()
    const token = (await cookieStore).get("token")?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: no token" },
        { status: 401 }
      )
    }

    const user = await verifyJwt(token)
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: invalid token" },
        { status: 401 }
      )
    }

    const userId = user.user_id as string
    console.log("User ID from token:", userId)

    const body = await req.json()
    const validation = CreateInventorySchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.format() },
        { status: 400 }
      )
    }

    const { supplier, status, items } = validation.data

    if (items && items.length > 0) {
      const requestSkus = items.map((i) => i.sku)

      const products = await db.product.findMany({
        where: { sku: { in: requestSkus } },
        select: { sku: true },
      })

      const existingSkuSet = new Set(products.map((p) => p.sku))
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

    const totalAmount = items
      ? items.reduce((sum, item) => sum + item.quantity * item.price, 0)
      : 0

    const result = await db.$transaction(async (tx) => {
      const header = await tx.productInventoryHeader.create({
        data: {
          supplier,
          createdById: userId, // Use userId from header
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

      if (status === "COMPLETED" && items && items.length > 0) {
        const skuUpdates = new Map<string, number>()

        for (const item of items) {
          const currentQty = skuUpdates.get(item.sku) || 0
          skuUpdates.set(item.sku, currentQty + item.quantity)

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
