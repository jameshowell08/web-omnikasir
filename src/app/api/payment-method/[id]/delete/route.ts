// app/api/payment-methods/[id]/route.ts
import { NextResponse } from "next/server"
import { db } from "../../../../../modules/shared/util/db"

type Params = {
  params: { id: string }
}

export async function DELETE(_req: Request, { params }: Params) {
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

    if (paymentMethod._count.transactionHeaders > 0) {
      return NextResponse.json(
        {
          status: false,
          message:
            "Cannot delete payment method because it is already used in transactions",
        },
        { status: 400 },
      )
    }

    await db.paymentMethod.delete({
      where: { paymentId: id },
    })

    return NextResponse.json({
      status: true,
      message: "Payment method deleted",
    })
  } catch (error) {
    console.error("Delete Payment Method API Error:", error)
    return NextResponse.json(
      { status: false, message: "Failed to delete payment method" },
      { status: 500 },
    )
  }
}
