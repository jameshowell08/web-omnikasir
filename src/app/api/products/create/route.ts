import { NextResponse } from "next/server"
import { db } from "../../../../modules/shared/util/db"
import { verifyJwt } from "@/src/modules/shared/util/auth"
import { cookies } from "next/headers"

export async function POST(req: Request) {
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

    const createdById = user.user_id as string

    const body = await req.json()

    const {
      sku,
      productName,
      brand,
      categoryId,
      quantity = 0,
      sellingPrice,
      buyingPrice,
      isNeedImei,
      imeis,
    } = body

    if (!sku) {
      return NextResponse.json(
        { status: false, message: "sku is required" },
        { status: 400 }
      )
    }
    if (!productName) {
      return NextResponse.json(
        { status: false, message: "productName is required" },
        { status: 400 }
      )
    }
    if (!categoryId) {
      return NextResponse.json(
        { status: false, message: "categoryId is required" },
        { status: 400 }
      )
    }
    if (
      quantity === undefined ||
      !Number.isInteger(Number(quantity)) ||
      Number(quantity) < 0
    ) {
      return NextResponse.json(
        { status: false, message: "quantity must be a non-negative integer" },
        { status: 400 }
      )
    }
    if (
      sellingPrice === undefined ||
      Number.isNaN(Number(sellingPrice)) ||
      Number(sellingPrice) < 0
    ) {
      return NextResponse.json(
        {
          status: false,
          message: "sellingPrice must be a non-negative number",
        },
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

    const category = await db.productCategory.findUnique({
      where: { categoryId },
    })
    if (!category) {
      return NextResponse.json(
        { status: false, message: "Category not found" },
        { status: 404 }
      )
    }

    const createdProduct = await db.product.create({
      data: {
        sku,
        productName,
        brand,
        category: { connect: { categoryId } },
        createdBy: { connect: { userId: createdById } },
        quantity: Number(quantity),
        sellingPrice: String(Number(sellingPrice).toFixed(2)),
        ...(buyingPrice !== undefined
          ? { buyingPrice: String(Number(buyingPrice).toFixed(2)) }
          : {}),
        isNeedImei: isNeedImei,
        ...(imeiCreates.length ? { imeis: { create: imeiCreates } } : {}),
      },
      include: {
        category: true,
        createdBy: true,
        imeis: true,
      },
    })

    return NextResponse.json({
      status: true,
      message: "Product created",
      data: {
        sku: createdProduct.sku,
        productName: createdProduct.productName,
        brand: createdProduct.brand,
        categoryId: createdProduct.categoryId,
        categoryName: createdProduct.category?.categoryName ?? null,
        quantity: createdProduct.quantity,
        sellingPrice: createdProduct.sellingPrice,
        buyingPrice: createdProduct.buyingPrice ?? null,
        isNeedImei: isNeedImei || false,
        imeis: createdProduct.imeis?.map((i: any) => i.imei) ?? [],
      },
    })
  } catch (error) {
    console.error("Create Product API Error:", error)
    return NextResponse.json(
      { status: false, message: "Failed to create product" },
      { status: 500 }
    )
  }
}
