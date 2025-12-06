import { NextResponse } from "next/server"
import { db } from "../../../../modules/shared/util/db"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)

    const search = url.searchParams.get("search") || ""
    const page = Number(url.searchParams.get("page")) || 1
    const limit = Number(url.searchParams.get("limit")) || 10
    const categoryId = url.searchParams.get("categoryId") || ""
    const categoryName = url.searchParams.get("categoryName") || "" // <-- new
    const brand = url.searchParams.get("brand") || ""

    const minPrice = url.searchParams.get("minPrice")
    const maxPrice = url.searchParams.get("maxPrice")
    const minStock = url.searchParams.get("minStock")
    const maxStock = url.searchParams.get("maxStock")

    const skip = (page - 1) * limit

    // Build Prisma filter
    const where: any = {}

    // Search filter
    if (search) {
      where.OR = [
        { sku: { contains: search, mode: "insensitive" } },
        { productName: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
      ]
    }

    // Category filter by ID
    if (categoryId) {
      where.categoryId = categoryId
    }

    // Category filter by name (relation)
    if (categoryName) {
      where.category = {
        categoryName: { contains: categoryName, mode: "insensitive" },
      }
    }

    // Brand filter
    if (brand) {
      where.brand = {
        contains: brand,
        mode: "insensitive",
      }
    }

    // Price filters
    if (minPrice || maxPrice) {
      where.sellingPrice = {}
      if (minPrice) where.sellingPrice.gte = Number(minPrice)
      if (maxPrice) where.sellingPrice.lte = Number(maxPrice)
    }

    // Stock filters
    if (minStock || maxStock) {
      where.quantity = {}
      if (minStock) where.quantity.gte = Number(minStock)
      if (maxStock) where.quantity.lte = Number(maxStock)
    }

    // Query DB
    const products = await db.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { productName: "asc" },
      include: {
        category: true,
      },
    })

    const totalRows = await db.product.count({ where })
    const totalPages = limit > 0 ? Math.ceil(totalRows / limit) : 0

    // Format for UI
    const data = products.map((p) => {
      const sellingPriceNumber =
        p.sellingPrice && typeof (p.sellingPrice as any).toNumber === "function"
          ? (p.sellingPrice as any).toNumber()
          : Number(p.sellingPrice)

      return {
        sku: p.sku,
        productName: p.productName,
        brand: p.brand,
        categoryName: p.category?.categoryName || "Unknown",
        quantity: p.quantity,
        sellingPrice: sellingPriceNumber,
      }
    })

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
// ...existing code...
