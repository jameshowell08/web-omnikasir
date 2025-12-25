import { NextRequest, NextResponse } from "next/server"
import { db } from "../../../../modules/shared/util/db"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { requireAdmin } from "@/src/modules/shared/middleware/auth"

// Validation for Update
const UpdateUserSchema = z.object({
  username: z.string().min(5, "Username minimal 5 karakter!").optional(),
  password: z.string().min(8, "Password minimal 8 karakter!").optional(),
  role: z.enum(["ADMIN", "CASHIER"]).optional(),
  isActive: z.boolean().optional(),
})

type Params = { params: { id: string } }

export async function GET(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin(req)
  if ("error" in auth) return auth.error

  try {
    const user = await db.users.findUnique({
      where: { userId: params.id },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User tidak ditemukan" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: user })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin(req)
  if ("error" in auth) return auth.error

  try {
    const body = await req.json()
    const validation = UpdateUserSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { success: true, error: validation.error.format() },
        { status: 400 }
      )
    }

    const dataToUpdate = { ...validation.data }

    // Logic: If password exists in the request, hash it and replace the old one
    if (dataToUpdate.password) {
      dataToUpdate.password = bcrypt.hashSync(dataToUpdate.password, 10)
    }

    const updatedUser = await db.users.update({
      where: { userId: params.id },
      data: dataToUpdate,
    })

    return NextResponse.json({ success: true, data: updatedUser })
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "User tidak ditemukan" },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui user" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin(req)
  if ("error" in auth) return auth.error

  try {
    await db.users.update({
      where: { userId: params.id },
      data: { isActive: false },
    })

    return NextResponse.json({
      success: true,
      message: "User berhasil dinonaktifkan",
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal menonaktifkan user" },
      { status: 500 }
    )
  }
}
