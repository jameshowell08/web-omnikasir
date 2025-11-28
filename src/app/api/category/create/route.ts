// app/api/category/create/route.ts
import { NextResponse } from "next/server"
import { db } from "../../../../modules/shared/util/db"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { categoryName, description, createdById } = body

    // Basic validation
    if (!categoryName || typeof categoryName !== "string") {
      return NextResponse.json(
        { status: false, message: "categoryName is required" },
        { status: 400 },
      )
    }

    if (!createdById || typeof createdById !== "string") {
      return NextResponse.json(
        { status: false, message: "createdById is required" },
        { status: 400 },
      )
    }

    // Check user exist
    const user = await db.users.findUnique({
      where: { userId: createdById },
    })

    if (!user) {
      return NextResponse.json(
        { status: false, message: "User (createdById) not found" },
        { status: 404 },
      )
    }

    // Optional: cek duplicate nama category
    const existingCategory = await db.productCategory.findFirst({
      where: {
        categoryName: {
          equals: categoryName,
          mode: "insensitive",
        },
      },
    })

    if (existingCategory) {
      return NextResponse.json(
        { status: false, message: "Category name already exists" },
        { status: 409 },
      )
    }

    const createdCategory = await db.productCategory.create({
      data: {
        categoryName,
        description: description ?? null,
        createdBy: { connect: { userId: createdById } },
        // modifiedById dibiarkan null, diupdate saat edit
      },
      include: {
        createdBy: true,
        modifiedBy: true,
      },
    })

    return NextResponse.json(
      {
        status: true,
        message: "Category created",
        data: {
          categoryId: createdCategory.categoryId,
          categoryName: createdCategory.categoryName,
          description: createdCategory.description,
          createdDate: createdCategory.createdDate,
          modifiedDate: createdCategory.modifiedDate,
          createdById: createdCategory.createdById,
          modifiedById: createdCategory.modifiedById,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create Category API Error:", error)
    return NextResponse.json(
      { status: false, message: "Failed to create category" },
      { status: 500 },
    )
  }
}
