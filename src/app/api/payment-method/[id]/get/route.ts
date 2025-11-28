// app/api/payment-methods/[id]/route.ts
import { NextResponse } from "next/server"
import { db } from "../../../../../modules/shared/util/db"

type Params = {
  params: { id: string }
}

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = params

    const paymentMethod = await db.paymentMethod.findUnique({
      where: { paymentId: id },
      include: {
        _count: {
          select: { transactionHeaders: true },
        },
      },
    })

    if (!paymentMethod) {
      return NextResponse.json(
        { status: false, message: "Payment method not found" },
        { status: 404 },
      )
    }

    return NextResponse.json({
      status: true,
      data: {
        paymentId: paymentMethod.paymentId,
        paymentName: paymentMethod.paymentName,
        totalTransactions: paymentMethod._count.transactionHeaders,
      },
    })
  } catch (error) {
    console.error("Get Payment Method Detail API Error:", error)
    return NextResponse.json(
      { status: false, message: "Failed to fetch payment method detail" },
      { status: 500 },
    )
  }
}
