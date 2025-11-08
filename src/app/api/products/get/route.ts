import { NextResponse } from "next/server"
import { db } from "../../../../modules/shared/util/db"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)

    // Query parameters
    const search = url.searchParams.get("search") || ""
    const page = Number(url.searchParams.get("page")) || 1
    const limit = Number(url.searchParams.get("limit")) || 10
    const categoryId = url.searchParams.get("categoryId") || ""
    const skuId = url.searchParams.get("skuId") || ""

    const skip = (page - 1) * limit

    // Build filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {}

    if (search) {
      filter.OR = [
        {
          sku: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          product: {
            productName: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          product: {
            brand: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ]
    }

    if (categoryId) {
      filter.product = {
        ...filter.product,
        categoryId: categoryId,
      }
    }

    if (skuId) {
      filter.skuId = skuId
    }

    const products = await db.productSku.findMany({
      where: filter,
      skip,
      take: limit,
      orderBy: { createdDate: "desc" },
      include: {
        product: {
          include: {
            category: true,
          },
        },
        inventories: {
          include: {
            inventory: true,
          },
        },
        serialNumbers: {
          where: {
            status: "IN_STOCK",
          },
        },
        transactionDetails: {
          include: {
            transactionHeader: true,
          },
          orderBy: {
            transactionHeader: {
              transactionDate: "desc",
            },
          },
          take: 5,
        },
      },
    })

    const totalRows = await db.productSku.count({ where: filter })
    const totalPages = Math.ceil(totalRows / limit)

    const data = products.map((sku) => ({
      skuId: sku.skuId,
      sku: sku.sku,
      barcode: sku.barcode,
      productId: sku.product.productId,
      productName: sku.product.productName,
      brand: sku.product.brand,
      description: sku.product.description,

      category: {
        categoryId: sku.product.category?.categoryId,
        categoryName: sku.product.category?.categoryName,
        description: sku.product.category?.description,
      },

      priceSell: sku.priceSell,
      priceBuy: sku.priceBuy,

      stock: sku.stock,
      stockBreakdown: {
        totalStock: sku.stock,
        reserved: sku.inventories.reduce((sum, inv) => sum + inv.reserved, 0),
        inTransit: sku.inventories.reduce((sum, inv) => sum + inv.inTransit, 0),
        available:
          sku.stock -
          sku.inventories.reduce((sum, inv) => sum + inv.reserved, 0),
      },

      inventories: sku.inventories.map((inv) => ({
        inventoryId: inv.inventoryId,
        quantity: inv.quantity,
        reserved: inv.reserved,
        inTransit: inv.inTransit,
        inventoryNote: inv.inventory?.note,
      })),

      serialRequired: sku.serialRequired,
      availableSerialNumbers: sku.serialNumbers.length,
      serialNumbers: sku.serialRequired
        ? sku.serialNumbers.map((sn) => ({
            serialId: sn.serialId,
            serialNo: sn.serialNo,
            status: sn.status,
            warrantyUntil: sn.warrantyUntil,
          }))
        : [],

      attributes: sku.attributes,

      createdDate: sku.createdDate,
      modifiedDate: sku.modifiedDate,
      productCreatedDate: sku.product.createdDate,
      productModifiedDate: sku.product.modifiedDate,

      recentTransactions: sku.transactionDetails.map((td) => ({
        transactionId: td.transactionHeader.transactionHeaderId,
        transactionDate: td.transactionHeader.transactionDate,
        quantity: td.quantity,
        price: td.price,
      })),
    }))

    return NextResponse.json({
      status: true,
      page,
      limit,
      totalRows,
      totalPages,
      data,
    })
  } catch (error) {
    console.error("Get Products API Error:", error)
    return NextResponse.json(
      { status: false, message: "Failed to fetch products" },
      { status: 500 }
    )
  }
}
