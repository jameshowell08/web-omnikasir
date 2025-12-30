// app/api/categories/get/route.ts
import { NextRequest, NextResponse } from "next/server"
import { db } from "../../../../modules/shared/util/db"
import { requireAnyRole } from "@/src/modules/shared/middleware/auth"

export async function GET(req: NextRequest) {
  const auth = await requireAnyRole()
  if ("error" in auth) return auth.error
  try {
    const url = new URL(req.url)

    const search = url.searchParams.get("search") || ""
    const createdById = url.searchParams.get("createdById") || ""

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
      orderBy: {
        categoryName: "asc",
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    })

    const data = categories.map((c) => ({
      categoryId: c.categoryId,
      categoryName: c.categoryName,
      description: c.description,
      totalProducts: c._count.products,
    }))

    return NextResponse.json({
      status: true,
      totalRows: data.length,
      data,
    })
  } catch (error) {
    console.error("Get Categories API Error:", error)
    return NextResponse.json(
      { status: false, message: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}
