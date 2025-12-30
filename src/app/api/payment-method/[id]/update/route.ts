// app/api/payment-methods/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { db } from "../../../../../modules/shared/util/db"
import { requireAdmin } from "@/src/modules/shared/middleware/auth"

type Params = {
  params: Promise<{ id: string }>
}

export async function PUT(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin()
  if ("error" in auth) return auth.error
  try {
    const { id } = await params
    const body = await req.json()

    const { paymentName } = body

    if (!paymentName || typeof paymentName !== "string") {
      return NextResponse.json(
        { status: false, message: "paymentName is required" },
        { status: 400 }
      )
    }

    const existing = await db.paymentMethod.findUnique({
      where: { paymentId: id },
    })

    if (!existing) {
      return NextResponse.json(
        { status: false, message: "Payment method not found" },
        { status: 404 }
      )
    }

    // Optional: cek duplicate name
    const duplicate = await db.paymentMethod.findFirst({
      where: {
        paymentName: { equals: paymentName, mode: "insensitive" },
        NOT: { paymentId: id },
      },
    })

    if (duplicate) {
      return NextResponse.json(
        { status: false, message: "Payment method name already exists" },
        { status: 409 }
      )
    }

    const updated = await db.paymentMethod.update({
      where: { paymentId: id },
      data: {
        paymentName,
      },
    })

    return NextResponse.json({
      status: true,
      message: "Payment method updated",
      data: {
        paymentId: updated.paymentId,
        paymentName: updated.paymentName,
      },
    })
  } catch (error) {
    console.error("Update Payment Method API Error:", error)
    return NextResponse.json(
      { status: false, message: "Failed to update payment method" },
      { status: 500 }
    )
  }
}
