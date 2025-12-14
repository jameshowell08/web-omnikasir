import { NextRequest, NextResponse } from "next/server"
import { db } from "../../../../modules/shared/util/db"
import { z } from "zod"
import { verifyJwt } from "@/src/modules/shared/util/auth"
import { cookies } from "next/headers"

const InventoryItemSchema = z.object({
  sku: z.string().min(1),
  quantity: z.number().int().positive().default(1),
  price: z.number().min(0),
  imeiCode: z.string().optional().nullable(),
})

const UpdateInventorySchema = z.object({
  supplier: z.string().min(1).optional(),
  status: z.enum(["DRAFT", "COMPLETED", "CANCELLED"]),
  items: z.array(InventoryItemSchema).optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const inventoryHeader = await db.productInventoryHeader.findUnique({
      where: { id },
      include: {
        productInventoryDetails: {
          orderBy: { sku: "asc" },
          include: {
            Product: {
              select: {
                productName: true,
                brand: true,
                category: {
                  select: {
                    categoryName: true
                  }
                }
              }
            }
          },
        },
        createdBy: { select: { username: true } },
        modifiedBy: { select: { username: true } },
      },
    })

    if (!inventoryHeader) {
      return NextResponse.json(
        { success: false, error: "Inventory not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: inventoryHeader,
    })
  } catch (error) {
    console.error("Error fetching inventory:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch inventory" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

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

    const modifiedById = user.user_id as string

    const body = await request.json()
    const validation = UpdateInventorySchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.format() },
        { status: 400 }
      )
    }

    const { supplier, status: newStatus, items } = validation.data

    const result = await db.$transaction(async (tx) => {
      const existingHeader = await tx.productInventoryHeader.findUnique({
        where: { id },
        include: { productInventoryDetails: true },
      })

      if (!existingHeader) throw new Error("Inventory ID not found")

      if (existingHeader.status === "COMPLETED" && newStatus !== "CANCELLED") {
        throw new Error("Cannot edit an inventory that is already COMPLETED.")
      }

      const totalPrice = items
        ? items.reduce((sum, item) => sum + item.quantity * item.price, 0)
        : existingHeader.totalPrice

      const updatedHeader = await tx.productInventoryHeader.update({
        where: { id },
        data: {
          ...(supplier && { supplier }),
          modifiedById,
          status: newStatus,
          totalPrice,
        },
      })

      if (items) {
        await tx.productInventoryDetail.deleteMany({
          where: { headerId: id },
        })

        await tx.productInventoryDetail.createMany({
          data: items.map((item) => ({
            headerId: id,
            sku: item.sku,
            quantity: item.quantity,
            price: item.price,
            imeiCode: item.imeiCode || null,
          })),
        })
      }

      if (existingHeader.status === "DRAFT" && newStatus === "COMPLETED") {
        const itemsToProcess = items || existingHeader.productInventoryDetails

        if (!itemsToProcess || itemsToProcess.length === 0) {
          throw new Error("Cannot complete inventory with no items")
        }

        const skuUpdates = new Map<string, number>()

        for (const item of itemsToProcess) {
          const qty = "quantity" in item ? item.quantity : 0
          const currentQty = skuUpdates.get(item.sku) || 0
          skuUpdates.set(item.sku, currentQty + qty)

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

        for (const [sku, totalQty] of skuUpdates.entries()) {
          await tx.product.update({
            where: { sku },
            data: { quantity: { increment: totalQty } },
          })
        }
      }

      return updatedHeader
    })

    return NextResponse.json({ success: true, data: result })
  } catch (error: any) {
    console.error("Error updating inventory:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const header = await db.productInventoryHeader.findUnique({
      where: { id },
    })

    if (!header) {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 }
      )
    }

    if (header.status !== "DRAFT") {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete. Only DRAFT inventory can be deleted.",
        },
        { status: 400 }
      )
    }

    await db.$transaction([
      db.productInventoryDetail.deleteMany({
        where: { headerId: id },
      }),
      db.productInventoryHeader.delete({
        where: { id },
      }),
    ])

    return NextResponse.json({
      success: true,
      message: "Inventory deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting inventory:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete inventory" },
      { status: 500 }
    )
  }
}
