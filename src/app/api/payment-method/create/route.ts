// app/api/payment-methods/route.ts
import { NextRequest, NextResponse } from "next/server"
import { db } from "../../../../modules/shared/util/db"
import { requireAdmin } from "@/src/modules/shared/middleware/auth"

export async function POST(req: NextRequest) {
  const auth = await requireAdmin()
  if ("error" in auth) return auth.error
  try {
    const body = await req.json()

    const { paymentName } = body

    if (!paymentName || typeof paymentName !== "string") {
      return NextResponse.json(
        { status: false, message: "paymentName is required" },
        { status: 400 }
      )
    }

    // Optional: cek duplicate name (case-insensitive)
    const existing = await db.paymentMethod.findFirst({
      where: {
        paymentName: {
          equals: paymentName,
          mode: "insensitive",
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { status: false, message: "Payment method already exists" },
        { status: 409 }
      )
    }

    const created = await db.paymentMethod.create({
      data: {
        paymentName,
      },
    })

    return NextResponse.json(
      {
        status: true,
        message: "Payment method created",
        data: {
          paymentId: created.paymentId,
          paymentName: created.paymentName,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Create Payment Method API Error:", error)
    return NextResponse.json(
      { status: false, message: "Failed to create payment method" },
      { status: 500 }
    )
  }
}
