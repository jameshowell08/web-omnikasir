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
                isNeedImei: true,
                category: {
                  select: {
                    categoryName: true,
                  },
                },
              },
            },
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

    const body = await request.json()
    const validation = UpdateInventorySchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.format() },
        { status: 400 }
      )
    }

    const { supplier, status: newStatus, items } = validation.data

    const result = await db.$transaction(
      async (tx) => {
        const existingHeader = await tx.productInventoryHeader.findUnique({
          where: { id },
          include: { productInventoryDetails: true },
        })

        if (!existingHeader) throw new Error("Inventory record not found")

        if (existingHeader.status === "CANCELLED") {
          throw new Error("Cannot modify a cancelled inventory record.")
        }

        if (existingHeader.status === newStatus && !items) {
          return existingHeader
        }

        if (
          existingHeader.status === "COMPLETED" &&
          newStatus === "CANCELLED"
        ) {
          for (const detail of existingHeader.productInventoryDetails) {
            await tx.product.update({
              where: { sku: detail.sku },
              data: { quantity: { decrement: detail.quantity } },
            })
            if (detail.imeiCode) {
              await tx.imei.deleteMany({
                where: { imei: detail.imeiCode, isSold: false },
              })
            }
          }
        } else if (
          existingHeader.status === "DRAFT" &&
          newStatus === "COMPLETED"
        ) {
          const itemsToProcess = items || existingHeader.productInventoryDetails
          if (itemsToProcess.length === 0)
            throw new Error("Cannot complete empty inventory")

          for (const item of itemsToProcess) {
            if (item.imeiCode) {
              await tx.imei.upsert({
                where: { imei: item.imeiCode },
                update: { sku: item.sku },
                create: { imei: item.imeiCode, sku: item.sku, isSold: false },
              })
            }
            await tx.product.update({
              where: { sku: item.sku },
              data: { quantity: { increment: item.quantity } },
            })
          }
        }

        if (existingHeader.status === "DRAFT" && items) {
          for (const item of items) {
            if (item.imeiCode) {
              await tx.imei.upsert({
                where: { imei: item.imeiCode },
                update: { sku: item.sku },
                create: { imei: item.imeiCode, sku: item.sku, isSold: false },
              })
            }
          }

          await tx.productInventoryDetail.deleteMany({
            where: { headerId: id },
          })
          await tx.productInventoryDetail.createMany({
            data: items.map((i) => ({
              headerId: id,
              sku: i.sku,
              quantity: i.quantity,
              price: i.price,
              imeiCode: i.imeiCode || null,
            })),
          })
        }
        const newTotalPrice =
          existingHeader.status === "DRAFT" && items
            ? items.reduce((sum, i) => sum + i.quantity * i.price, 0)
            : existingHeader.totalPrice

        return await tx.productInventoryHeader.update({
          where: { id },
          data: {
            status: newStatus,
            modifiedById: user.user_id as string,
            ...(existingHeader.status === "DRAFT" && {
              supplier: supplier ?? existingHeader.supplier,
              totalPrice: newTotalPrice,
            }),
          },
        })
      },
      { timeout: 15000 }
    )

    return NextResponse.json({ success: true, data: result })
  } catch (error: any) {
    console.error("Inventory Update Error:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update inventory" },
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
