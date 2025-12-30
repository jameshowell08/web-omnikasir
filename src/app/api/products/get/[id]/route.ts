import { NextRequest, NextResponse } from "next/server"
import { db } from "../../../../../modules/shared/util/db"
import { requireAnyRole } from "@/src/modules/shared/middleware/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAnyRole()
  if ("error" in auth) return auth.error
  try {
    const { id } = await params
    const sku = id

    if (!sku || sku.trim().length === 0) {
      return NextResponse.json(
        { status: false, message: "SKU is required" },
        { status: 400 }
      )
    }

    const product = await db.product.findUnique({
      where: { sku: sku.trim() },
      include: {
        category: true,
        imeis: true,
      },
    })

    if (!product) {
      return NextResponse.json(
        { status: false, message: "Product not found" },
        { status: 404 }
      )
    }

    const sellingPriceNumber =
      product.sellingPrice &&
        typeof (product.sellingPrice as any).toNumber === "function"
        ? (product.sellingPrice as any).toNumber()
        : Number(product.sellingPrice)

    const buyingPriceNumber =
      product.buyingPrice &&
        typeof (product.buyingPrice as any).toNumber === "function"
        ? (product.buyingPrice as any).toNumber()
        : Number(product.buyingPrice)

    return NextResponse.json({
      status: true,
      data: {
        sku: product.sku,
        productName: product.productName,
        brand: product.brand,
        categoryId: product.categoryId,
        categoryName: product.category?.categoryName || "Unknown",
        quantity: product.quantity,
        sellingPrice: sellingPriceNumber,
        buyingPrice: buyingPriceNumber,
        isNeedImei: product.isNeedImei,
        imeis: product.imeis?.map((i) => i.imei) || [],
      },
    })
  } catch (error) {
    console.error("Get Product by SKU Error:", error)
    return NextResponse.json(
      { status: false, message: "Failed to fetch product" },
      { status: 500 }
    )
  }
}
