import { NextRequest, NextResponse } from "next/server"
import { db } from "../../../modules/shared/util/db"
import { z } from "zod"
import { Prisma } from "@prisma/client"
import { verifyJwt } from "@/src/modules/shared/util/auth"
import { cookies } from "next/headers"
import { requireAdmin } from "@/src/modules/shared/middleware/auth"

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
  const auth = await requireAdmin()
  if ("error" in auth) return auth.error
  try {
    const url = new URL(req.url)
    const { searchParams } = url

    const search = searchParams.get("search")
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
      ...(search && {
        OR: [
          { id: { contains: search, mode: "insensitive" } },
          { supplier: { contains: search, mode: "insensitive" } },
        ],
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
  const auth = await requireAdmin()
  if ("error" in auth) return auth.error

  try {
    // 1. AUTHENTICATION (Omitted for brevity, keep your existing logic)
    // 1. AUTHENTICATION

    const cookieStore = await cookies()

    const token = cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }
    const user = await verifyJwt(token)
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      )
    }
    const userId = user.user_id as string

    // 2. BODY VALIDATION
    const body = await req.json()
    const validation = CreateInventorySchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.format() },
        { status: 400 }
      )
    }

    const { supplier, status, items = [] } = validation.data // Default to empty array

    if (status === "CANCELLED") {
      return NextResponse.json(
        { success: false, message: "Status harus antara DRAFT or COMPLETED" },
        { status: 400 }
      )
    }

    // --- CHANGE 1: Conditional Items Check ---
    // If status is COMPLETED, items MUST NOT be empty.
    if (status === "COMPLETED" && (!items || items.length === 0)) {
      return NextResponse.json(
        {
          success: false,
          message: "Items tidak boleh kosong untuk status COMPLETED",
        },
        { status: 400 }
      )
    }

    // --- CHANGE 2: Conditional IMEI Check ---
    // If status is COMPLETED, ensure every item has an IMEI (if your business logic requires it)
    if (status === "COMPLETED") {
      const missingImei = items.some((item) => !item.imeiCode)
      if (missingImei) {
        return NextResponse.json(
          {
            success: false,
            message: "Semua item harus memiliki IMEI untuk status COMPLETED",
          },
          { status: 400 }
        )
      }
    }

    const totalPrice = items.reduce((sum, item) => {
      const q = Number(item.quantity)
      const p = Number(item.price)
      return sum + q * p
    }, 0)

    const result = await db.$transaction(
      async (tx) => {
        // STEP 1: Process IMEIs (Only if COMPLETED)
        if (status === "COMPLETED") {
          for (const item of items) {
            if (item.imeiCode) {
              await tx.imei.upsert({
                where: { imei: item.imeiCode },
                update: { sku: item.sku },
                create: {
                  imei: item.imeiCode,
                  sku: item.sku,
                  isSold: false,
                },
              })
            }
          }
        }

        // STEP 2: Create Header and Details
        const header = await tx.productInventoryHeader.create({
          data: {
            supplier,
            createdById: userId,
            status,
            totalPrice,
            productInventoryDetails: {
              // Create empty if items is empty
              create: items.map((item) => ({
                sku: item.sku,
                quantity: item.quantity,
                price: item.price,
                imeiCode: item.imeiCode || null,
              })),
            },
          },
          include: {
            productInventoryDetails: true,
            createdBy: { select: { username: true } },
          },
        })

        // STEP 3: APPLY STOCK (Only if COMPLETED)
        if (status === "COMPLETED") {
          for (const item of items) {
            await tx.product.update({
              where: { sku: item.sku },
              data: {
                quantity: { increment: item.quantity },
              },
            })
          }
        }

        return header
      },
      { timeout: 15000 }
    )

    return NextResponse.json({ success: true, data: result })
  } catch (error: any) {
    // ... error handling ...
  }
}
