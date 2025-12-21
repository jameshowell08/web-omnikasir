// app/api/categories/[id]/get/route.ts
import { NextRequest, NextResponse } from "next/server"
import { db } from "../../../../../modules/shared/util/db"
import { requireAdmin } from "@/src/modules/shared/middleware/auth"

type Params = {
  params: { id: string }
}

export async function GET(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin(req)
  if ("error" in auth) return auth.error
  try {
    const { id } = params

    const category = await db.productCategory.findUnique({
      where: { categoryId: id },
      include: {
        createdBy: true,
        modifiedBy: true,
        _count: { select: { products: true } },
      },
    })

    if (!category) {
      return NextResponse.json(
        { status: false, message: "Category not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      status: true,
      data: {
        categoryId: category.categoryId,
        categoryName: category.categoryName,
        description: category.description,
        createdDate: category.createdDate,
        modifiedDate: category.modifiedDate,
        createdById: category.createdById,
        modifiedById: category.modifiedById,
        totalProducts: category._count.products,
      },
    })
  } catch (error) {
    console.error("Get Category Detail API Error:", error)
    return NextResponse.json(
      { status: false, message: "Failed to fetch category detail" },
      { status: 500 }
    )
  }
}
