import { NextRequest, NextResponse } from "next/server"
import { db } from "../../../../modules/shared/util/db"
import { verifyJwt } from "@/src/modules/shared/util/auth"
import { cookies } from "next/headers"
import { requireAnyRole } from "@/src/modules/shared/middleware/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAnyRole(request)
  if ("error" in auth) return auth.error
  try {
    const { id } = await params

    const transaction = await db.transactionHeader.findUnique({
      where: { transactionHeaderId: id },
      include: {
        customer: {
          select: { customerName: true, customerPhoneNumber: true },
        },
        user: { select: { username: true } },
        createdBy: { select: { username: true } },
        paymentMethod: { select: { paymentName: true } },
        modifiedBy: { select: { username: true } },
        transactionDetails: {
          orderBy: { sku: "asc" },
          include: {
            product: {
              select: { productName: true, brand: true, sku: true },
            },
            imei: { select: { imei: true } },
          },
        },
      },
    })

    if (!transaction) {
      return NextResponse.json(
        { success: false, error: "Transaction not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: transaction })
  } catch (error) {
    console.error("Error fetching detail:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch details" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAnyRole(request)
  if ("error" in auth) return auth.error
  try {
    const { id } = await params

    const cookieStore = cookies()
    const token = (await cookieStore).get("token")?.value
    if (!token)
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )

    const user = await verifyJwt(token)
    if (!user)
      return NextResponse.json(
        { success: false, error: "Invalid Token" },
        { status: 401 }
      )

    const modifierId = user.user_id as string

    const result = await db.$transaction(async (tx) => {
      const transaction = await tx.transactionHeader.findUnique({
        where: { transactionHeaderId: id },
        include: { transactionDetails: true },
      })

      if (!transaction) throw new Error("Transaction ID not found")
      if (transaction.status === "VOID")
        throw new Error("Transaction is already voided")

      for (const item of transaction.transactionDetails) {
        await tx.product.update({
          where: { sku: item.sku },
          data: { quantity: { increment: item.quantity } },
        })

        if (item.imeiCode) {
          await tx.imei.update({
            where: { imei: item.imeiCode },
            data: { isSold: false },
          })
        }
      }

      const updatedHeader = await tx.transactionHeader.update({
        where: { transactionHeaderId: id },
        data: {
          status: "VOID",
          modifiedById: modifierId,
        },
      })

      return updatedHeader
    })

    return NextResponse.json({ success: true, data: result })
  } catch (error: any) {
    console.error("Error voiding transaction:", error)
    const status =
      error.message.includes("found") || error.message.includes("voided")
        ? 400
        : 500
    return NextResponse.json(
      { success: false, error: error.message || "Failed to void transaction" },
      { status }
    )
  }
}
