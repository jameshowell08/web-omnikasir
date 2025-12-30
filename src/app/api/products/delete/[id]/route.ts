import { NextRequest, NextResponse } from "next/server"
import { db } from "../../../../../modules/shared/util/db"
import { requireAdmin } from "@/src/modules/shared/middleware/auth"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin()
  if ("error" in auth) return auth.error
  try {
    const { id } = await params

    if (!id || id.trim().length === 0) {
      return NextResponse.json(
        { status: false, message: "SKU is required" },
        { status: 400 }
      )
    }

    const trimmedSku = id.trim()

    const product = await db.product.findUnique({
      where: { sku: trimmedSku },
    })

    if (!product) {
      return NextResponse.json(
        { status: false, message: "Product not found" },
        { status: 404 }
      )
    }

    const [inventoryCount, transactionCount] = await Promise.all([
      db.productInventoryDetail.count({ where: { sku: trimmedSku } }),
      db.transactionDetail.count({ where: { sku: trimmedSku } }),
    ])

    if (inventoryCount > 0 || transactionCount > 0) {
      return NextResponse.json(
        {
          status: false,
          message:
            "Cannot delete product. It is referenced in inventory or transactions.",
          details: { inventoryCount, transactionCount },
        },
        { status: 400 }
      )
    }

    await db.$transaction([
      db.imei.deleteMany({ where: { sku: trimmedSku } }),
      db.product.delete({ where: { sku: trimmedSku } }),
    ])

    return NextResponse.json({
      status: true,
      message: "Product deleted successfully",
    })
  } catch (error) {
    console.error("Delete Product Error:", error)
    return NextResponse.json(
      { status: false, message: "Failed to delete product" },
      { status: 500 }
    )
  }
}
