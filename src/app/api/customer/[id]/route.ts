import { NextRequest, NextResponse } from "next/server"
import { db } from "../../../../modules/shared/util/db"
import { z } from "zod"
import { verifyJwt } from "@/src/modules/shared/util/auth"
import { cookies } from "next/headers"
import { requireAnyRole } from "@/src/modules/shared/middleware/auth"

const UpdateCustomerSchema = z
  .object({
    customerName: z.string().min(1).max(255),
    customerEmail: z.string().email().optional().or(z.literal("")),
    customerPhoneNumber: z.string().max(20).optional().or(z.literal("")),
    customerAddress: z.string().optional().or(z.literal("")),
  })
  .partial()

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAnyRole()
  if ("error" in auth) return auth.error
  try {
    const { id } = await params

    const customer = await db.customer.findUnique({
      where: { customerId: id },
    })

    if (!customer) {
      return NextResponse.json(
        { success: false, message: "Customer tidak ditemukan" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: customer })
  } catch (error) {
    console.error("Detail Fetch Error:", error)
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAnyRole()
  if ("error" in auth) return auth.error
  try {
    const { id } = await params

    // Auth Check
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    if (!token || !(await verifyJwt(token))) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validation = UpdateCustomerSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.format() },
        { status: 400 }
      )
    }

    // Prepare data: Ensure empty strings from UI become null for database uniqueness
    const data = validation.data
    const formattedData = {
      ...data,
      ...(data.customerEmail === "" && { customerEmail: null }),
      ...(data.customerPhoneNumber === "" && { customerPhoneNumber: null }),
    }

    const updatedCustomer = await db.customer.update({
      where: { customerId: id },
      data: formattedData,
    })

    return NextResponse.json({ success: true, data: updatedCustomer })
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          message: "Nama, Email, atau nomor telepon sudah ada",
        },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, message: "Update gagal" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAnyRole()
  if ("error" in auth) return auth.error
  try {
    const { id } = await params

    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    if (!token || !(await verifyJwt(token))) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const softDeletedCustomer = await db.customer.update({
      where: { customerId: id },
      data: { isActive: false },
    })

    return NextResponse.json({
      success: true,
      message: "Customer berhasil didelete (deactivated)",
      data: { customerId: softDeletedCustomer.customerId, isActive: false },
    })
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal mengahapus customer" },
      { status: 500 }
    )
  }
}
