import { NextRequest, NextResponse } from "next/server"
import { db } from "../../../../modules/shared/util/db" // Adjust path
import { z } from "zod"

// Shared Zod Schema (Same as your POST)
const InventoryItemSchema = z.object({
  sku: z.string().min(1),
  quantity: z.number().int().positive().default(1),
  price: z.number().min(0),
  imeiCode: z.string().optional().nullable(),
})

const UpdateInventorySchema = z.object({
  supplier: z.string().min(1).optional(),
  modifiedById: z.string().uuid(), // ID of user editing
  status: z.enum(["DRAFT", "COMPLETED", "CANCELLED"]),
  items: z.array(InventoryItemSchema).optional(),
})
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const inventoryHeader = await db.productInventoryHeader.findUnique({
      where: { id: params.id },
      include: {
        productInventoryDetails: {
          orderBy: { sku: "asc" }, // Sort for easier reading in UI
          include: {
            product: {
              select: {
                productName: true,
                brand: true,
                // Include current stock if you want to show it in UI
                quantity: true,
              },
            },
            // Note: If you used the schema with 'imeiCode' string on the detail,
            // you don't strictly need to include 'imei' relation unless you want status
            imei: true,
          },
        },
        createdBy: { select: { username: true } },
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
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    // 1. Validate Input
    const validation = UpdateInventorySchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.format() },
        { status: 400 }
      )
    }

    const { supplier, modifiedById, status: newStatus, items } = validation.data

    // 2. Start Transaction
    const result = await db.$transaction(async (tx) => {
      // A. Fetch Current State (Locking not strictly needed but good for logic)
      const existingHeader = await tx.productInventoryHeader.findUnique({
        where: { id: params.id },
        include: { productInventoryDetails: true },
      })

      if (!existingHeader) throw new Error("Inventory ID not found")

      // B. Guard: Prevent editing if already COMPLETED
      // (Unless you have specific logic to allow editing completed stock, which is dangerous)
      if (existingHeader.status === "COMPLETED" && newStatus !== "CANCELLED") {
        throw new Error("Cannot edit an inventory that is already COMPLETED.")
      }

      // C. Recalculate Total Amount from new items
      const totalAmount = items
        ? items.reduce((sum, item) => sum + item.quantity * item.price, 0)
        : existingHeader.totalAmount

      // D. Update Header
      const updatedHeader = await tx.productInventoryHeader.update({
        where: { id: params.id },
        data: {
          supplier,
          modifiedById,
          status: newStatus,
          totalAmount,
        },
      })

      // E. HANDLE DETAILS: "Wipe and Replace" Strategy
      // Only do this if 'items' were actually sent in the body
      if (items) {
        // 1. Delete ALL existing details for this header
        await tx.productInventoryDetail.deleteMany({
          where: { headerId: params.id },
        })

        // 2. Create ALL new details
        await tx.productInventoryDetail.createMany({
          data: items.map((item) => ({
            headerId: params.id,
            sku: item.sku,
            quantity: item.quantity,
            price: item.price,
            imeiCode: item.imeiCode || null,
          })),
        })
      }

      // F. STATUS TRANSITION LOGIC
      // Check if we are moving from DRAFT -> COMPLETED
      if (existingHeader.status === "DRAFT" && newStatus === "COMPLETED") {
        const itemsToProcess = items || existingHeader.productInventoryDetails

        if (!itemsToProcess || itemsToProcess.length === 0) {
          throw new Error("Cannot complete inventory with no items")
        }

        // --- OPTIMIZED STOCK UPDATE (Same as POST) ---
        const skuUpdates = new Map<string, number>()

        for (const item of itemsToProcess) {
          // Accumulate Quantities
          const qty = "quantity" in item ? item.quantity : 0 // Type guard
          const currentQty = skuUpdates.get(item.sku) || 0
          skuUpdates.set(item.sku, currentQty + qty)

          // Register IMEIs
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

        // Execute Product Quantity Updates
        for (const [sku, totalQty] of skuUpdates.entries()) {
          await tx.product.update({
            where: { sku: sku },
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
  { params }: { params: { id: string } }
) {
  try {
    const header = await db.productInventoryHeader.findUnique({
      where: { id: params.id },
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

    // Use Transaction for clean deletion
    await db.$transaction([
      // 1. Delete Details
      db.productInventoryDetail.deleteMany({
        where: { headerId: params.id },
      }),
      // 2. Delete Header
      db.productInventoryHeader.delete({
        where: { id: params.id },
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
