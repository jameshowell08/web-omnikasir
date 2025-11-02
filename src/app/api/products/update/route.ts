import { NextResponse } from "next/server"
import { db } from "../../../../modules/shared/util/db"

export async function PUT(req: Request) {
  try {
    const body = await req.json()

    const {
      skuId,
      sku,
      productName,
      stock,
      categoryId,
      priceSell,
      priceBuy,
      barcode,
      attributes,
      serialRequired,
    } = body

    if (!skuId) {
      return NextResponse.json(
        { status: false, message: "SKU ID is required" },
        { status: 400 }
      )
    }

    if (
      !sku ||
      !productName ||
      stock === undefined ||
      !categoryId ||
      !priceSell
    ) {
      return NextResponse.json(
        { status: false, message: "All required fields are missing" },
        { status: 400 }
      )
    }

    const existingSku = await db.productSku.findUnique({
      where: { skuId },
      include: {
        product: true,
      },
    })

    if (!existingSku) {
      return NextResponse.json(
        { status: false, message: "Product SKU not found" },
        { status: 404 }
      )
    }

    if (sku !== existingSku.sku) {
      const skuExists = await db.productSku.findUnique({
        where: { sku },
      })

      if (skuExists) {
        return NextResponse.json(
          { status: false, message: "SKU code already exists" },
          { status: 400 }
        )
      }
    }

    const categoryExists = await db.productCategory.findUnique({
      where: { categoryId },
    })

    if (!categoryExists) {
      return NextResponse.json(
        { status: false, message: "Category not found" },
        { status: 404 }
      )
    }

    const result = await db.$transaction(async (tx) => {
      const updatedProduct = await tx.product.update({
        where: { productId: existingSku.productId },
        data: {
          productName,
          categoryId,
          modifiedBy: "system",
          modifiedDate: new Date(),
        },
        include: {
          category: true,
        },
      })

      const updatedSku = await tx.productSku.update({
        where: { skuId },
        data: {
          sku,
          priceSell: parseFloat(priceSell),
          priceBuy: priceBuy ? parseFloat(priceBuy) : null,
          stock: parseInt(stock),
          barcode: barcode || null,
          attributes: attributes
            ? typeof attributes === "string"
              ? JSON.parse(attributes)
              : attributes
            : null,
          serialRequired: serialRequired ?? existingSku.serialRequired,
          modifiedDate: new Date(),
        },
        include: {
          product: {
            include: {
              category: true,
            },
          },
          inventories: true,
          serialNumbers: {
            where: {
              status: "IN_STOCK",
            },
          },
        },
      })

      return {
        product: updatedProduct,
        sku: updatedSku,
      }
    })

    const reservedStock = result.sku.inventories.reduce(
      (sum, inv) => sum + inv.reserved,
      0
    )
    const availableStock = result.sku.stock - reservedStock

    return NextResponse.json({
      status: true,
      message: "Product updated successfully",
      data: {
        // SKU Information
        skuId: result.sku.skuId,
        sku: result.sku.sku,
        barcode: result.sku.barcode,

        // Product Information
        productId: result.product.productId,
        productName: result.product.productName,
        brand: result.product.brand,
        description: result.product.description,

        // Category Information
        categoryId: result.product.categoryId,
        categoryName: result.product.category?.categoryName,

        // Pricing Information
        priceSell: result.sku.priceSell.toString(),
        priceBuy: result.sku.priceBuy?.toString() || null,

        // Stock Information
        stock: result.sku.stock,
        availableStock: availableStock,
        reservedStock: reservedStock,

        // Serial Information
        serialRequired: result.sku.serialRequired,
        availableSerialNumbers: result.sku.serialNumbers.length,

        // Attributes
        attributes: result.sku.attributes,

        // Timestamps
        createdDate: result.sku.createdDate,
        modifiedDate: result.sku.modifiedDate,
        productCreatedDate: result.product.createdDate,
        productModifiedDate: result.product.modifiedDate,
      },
    })
  } catch (error) {
    console.error("Update Product API Error:", error)

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { status: false, message: "Record not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { status: false, message: "Failed to update product" },
      { status: 500 }
    )
  }
}
