// app/api/categories/get/route.ts
import { NextResponse } from "next/server"
import { db } from "../../../../modules/shared/util/db"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)

    const search = url.searchParams.get("search") || ""
    const page = Number(url.searchParams.get("page")) || 1
    const limit = Number(url.searchParams.get("limit")) || 10
    const createdById = url.searchParams.get("createdById") || ""

    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        {
          categoryName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ]
    }

    if (createdById) {
      where.createdById = createdById
    }

    const categories = await db.productCategory.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        categoryName: "asc",
      },
      include: {
        createdBy: true,
        modifiedBy: true,
        _count: {
          select: { products: true },
        },
      },
    })

    const totalRows = await db.productCategory.count({ where })
    const totalPages = limit > 0 ? Math.ceil(totalRows / limit) : 0

    const data = categories.map((c) => ({
      categoryId: c.categoryId,
      categoryName: c.categoryName,
      description: c.description,
      createdDate: c.createdDate,
      modifiedDate: c.modifiedDate,
      createdById: c.createdById,
      modifiedById: c.modifiedById,
      totalProducts: c._count.products,
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
    console.error("Get Categories API Error:", error)
    return NextResponse.json(
      { status: false, message: "Failed to fetch categories" },
      { status: 500 },
    )
  }
}
