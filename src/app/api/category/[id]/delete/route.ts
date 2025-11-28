// app/api/categories/[id]/delete/route.ts
import { NextResponse } from "next/server"
import { db } from "../../../../../modules/shared/util/db"

type Params = {
  params: { id: string }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = params

    const category = await db.productCategory.findUnique({
      where: { categoryId: id },
      include: { _count: { select: { products: true } } },
    })

    if (!category) {
      return NextResponse.json(
        { status: false, message: "Category not found" },
        { status: 404 },
      )
    }

    if (category._count.products > 0) {
      return NextResponse.json(
        {
          status: false,
          message:
            "Cannot delete category because it still has related products",
        },
        { status: 400 },
      )
    }

    await db.productCategory.delete({
      where: { categoryId: id },
    })

    return NextResponse.json({
      status: true,
      message: "Category deleted",
    })
  } catch (error: any) {
    console.error("Delete Category API Error:", error)
    return NextResponse.json(
      { status: false, message: "Failed to delete category" },
      { status: 500 },
    )
  }
}
