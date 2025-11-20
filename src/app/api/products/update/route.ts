// ...existing code...
import { NextResponse } from "next/server"
import { db } from "../../../../modules/shared/util/db"

export async function PUT(req: Request) {
  try {
    const body = await req.json()

    const {
      sku, // primary key
      productName,
      categoryId,
      quantity,
      sellingPrice,
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
        categoryId: categoryIdStr,
        quantity: quantityNum,
        // Prisma Decimal column accepts string/number; use string to be explicit
        sellingPrice: String(sellingPriceNum),
        // don't set modifiedDate — field doesn't exist on Product in schema
        modifiedById: "system", // adjust based on your auth later
      },
      include: {
        category: true,
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
// ...existing code...
