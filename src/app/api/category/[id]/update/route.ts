// app/api/categories/[id]/update/route.ts
import { NextResponse } from "next/server"
import { db } from "../../../../../modules/shared/util/db"

type Params = {
  params: { id: string }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const { id } = params
    const body = await req.json()

    const { categoryName, description, modifiedById } = body

    if (!modifiedById || typeof modifiedById !== "string") {
      return NextResponse.json(
        { status: false, message: "modifiedById is required" },
        { status: 400 },
      )
    }

    const category = await db.productCategory.findUnique({
      where: { categoryId: id },
    })

    if (!category) {
      return NextResponse.json(
        { status: false, message: "Category not found" },
        { status: 404 },
      )
    }

    const user = await db.users.findUnique({
      where: { userId: modifiedById },
    })

    if (!user) {
      return NextResponse.json(
        { status: false, message: "User (modifiedById) not found" },
        { status: 404 },
      )
    }

    // Optional: cek duplicate nama kalau categoryName berubah
    if (
      categoryName &&
      categoryName.toLowerCase() !== category.categoryName.toLowerCase()
    ) {
      const duplicate = await db.productCategory.findFirst({
        where: {
          categoryName: { equals: categoryName, mode: "insensitive" },
          NOT: { categoryId: id },
        },
      })

      if (duplicate) {
        return NextResponse.json(
          { status: false, message: "Category name already exists" },
          { status: 409 },
        )
      }
    }

    const updatedCategory = await db.productCategory.update({
      where: { categoryId: id },
      data: {
        ...(categoryName ? { categoryName } : {}),
        description: description ?? null,
        modifiedBy: { connect: { userId: modifiedById } },
      },
      include: {
        createdBy: true,
        modifiedBy: true,
      },
    })

    return NextResponse.json({
      status: true,
      message: "Category updated",
      data: {
        categoryId: updatedCategory.categoryId,
        categoryName: updatedCategory.categoryName,
        description: updatedCategory.description,
        createdDate: updatedCategory.createdDate,
        modifiedDate: updatedCategory.modifiedDate,
        createdById: updatedCategory.createdById,
        modifiedById: updatedCategory.modifiedById,
      },
    })
  } catch (error) {
    console.error("Update Category API Error:", error)
    return NextResponse.json(
      { status: false, message: "Failed to update category" },
      { status: 500 },
    )
  }
}

// Atau kalau mau PATCH instead of PUT, tinggal ganti nama export function PATCH
