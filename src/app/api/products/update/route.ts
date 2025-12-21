import { NextRequest, NextResponse } from "next/server"
import { db } from "../../../../modules/shared/util/db"
import { verifyJwt } from "@/src/modules/shared/util/auth"
import { cookies } from "next/headers"
import { requireAdmin } from "@/src/modules/shared/middleware/auth"

export async function PUT(req: NextRequest) {
  const auth = await requireAdmin(req)
  if ("error" in auth) return auth.error
  try {
    const cookieStore = cookies()
    const token = (await cookieStore).get("token")?.value

    if (!token) {
      return NextResponse.json(
        { status: false, message: "Unauthorized: no token" },
        { status: 401 }
      )
    }

    const user = await verifyJwt(token)
    if (!user) {
      return NextResponse.json(
        { status: false, message: "Unauthorized: invalid token" },
        { status: 401 }
      )
    }

    const modifiedById = user.user_id as string

    const body = await req.json()

    const {
      sku,
      productName,
      brand,
      categoryId,
      quantity,
      sellingPrice,
      buyingPrice,
      isNeedImei,
      imeis,
    } = body

    // Basic required fields check
    if (!sku) {
      return NextResponse.json(
        { status: false, message: "SKU is required" },
        { status: 400 }
      )
    }

    if (
      !productName ||
      categoryId === undefined ||
      quantity === undefined ||
      sellingPrice === undefined
    ) {
      return NextResponse.json(
        { status: false, message: "All required fields must be filled" },
        { status: 400 }
      )
    }

    const imeiCreates = Array.isArray(imeis)
      ? imeis
          .filter((v) => typeof v === "string" && v.trim().length > 0)
          .map((imei) => ({ imei: imei.trim() }))
      : []

    if (isNeedImei && imeiCreates.length > 0) {
      if (imeiCreates.length !== Number(quantity)) {
        return NextResponse.json(
          {
            status: false,
            message: `For IMEI-tracked products, quantity (${quantity}) must equal number of IMEIs (${imeiCreates.length})`,
          },
          { status: 400 }
        )
      }
    }

    // Coerce/validate types
    const skuStr = String(sku).trim()
    const categoryIdStr = String(categoryId).trim()
    const quantityNum = Number(quantity)
    const sellingPriceNum = Number(sellingPrice)

    if (!skuStr) {
      return NextResponse.json(
        { status: false, message: "SKU is invalid" },
        { status: 400 }
      )
    }

    if (!categoryIdStr) {
      return NextResponse.json(
        { status: false, message: "categoryId is invalid" },
        { status: 400 }
      )
    }

    if (!Number.isInteger(quantityNum) || quantityNum < 0) {
      return NextResponse.json(
        { status: false, message: "quantity must be a non-negative integer" },
        { status: 400 }
      )
    }

    if (Number.isNaN(sellingPriceNum) || sellingPriceNum < 0) {
      return NextResponse.json(
        {
          status: false,
          message: "sellingPrice must be a non-negative number",
        },
        { status: 400 }
      )
    }

    // Check if product exists
    const existingProduct = await db.product.findUnique({
      where: { sku: skuStr },
    })

    if (!existingProduct) {
      return NextResponse.json(
        { status: false, message: "Product not found" },
        { status: 404 }
      )
    }

    // Check if category exists (categoryId is a string/uuid in Prisma schema)
    const categoryExists = await db.productCategory.findUnique({
      where: { categoryId: categoryIdStr },
    })

    if (!categoryExists) {
      return NextResponse.json(
        { status: false, message: "Category not found" },
        { status: 404 }
      )
    }

    // Update
    const updatedProduct = await db.product.update({
      where: { sku: skuStr },
      data: {
        productName,
        brand,
        categoryId: categoryIdStr,
        quantity: quantityNum,
        sellingPrice: String(sellingPriceNum),
        ...(buyingPrice !== undefined
          ? { buyingPrice: String(Number(buyingPrice).toFixed(2)) }
          : {}),
        modifiedById,
      },
      include: {
        category: true,
        imeis: true,
      },
    })

    return NextResponse.json({
      status: true,
      message: "Product updated successfully",
      data: {
        sku: updatedProduct.sku,
        productName: updatedProduct.productName,
        brand: updatedProduct.brand,
        categoryId: updatedProduct.categoryId,
        categoryName: updatedProduct.category?.categoryName ?? null,
        quantity: updatedProduct.quantity,
        sellingPrice: updatedProduct.sellingPrice,
        buyingPrice: updatedProduct.buyingPrice ?? null,
        isNeedImei: isNeedImei || false,
        imeis: updatedProduct.imeis?.map((i: any) => i.imei) ?? [],
        createdById: updatedProduct.createdById ?? null,
        modifiedById: updatedProduct.modifiedById ?? null,
      },
    })
  } catch (error) {
    console.error("Update Product API Error:", error)

    return NextResponse.json(
      { status: false, message: "Failed to update product" },
      { status: 500 }
    )
  }
}
