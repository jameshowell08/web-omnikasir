import { NextRequest, NextResponse } from "next/server"
import { db } from "../../../../modules/shared/util/db"
import { verifyJwt } from "@/src/modules/shared/util/auth"
import { cookies } from "next/headers"
import { requireAnyRole } from "@/src/modules/shared/middleware/auth"
import { z } from "zod"

const TransactionItemSchema = z.object({
  sku: z.string().min(1),
  quantity: z.number().int().positive().default(1),
  price: z.number().min(0),
  imeiCode: z.string().optional(),
})

const CreateTransactionSchema = z.object({
  customerId: z.string().optional().nullable(),
  paymentId: z.string().min(1),
  items: z.array(TransactionItemSchema).min(1),
})

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
    const { id: oldTransactionId } = await params
    const body = await request.json()

    // 1. Validate New Transaction Data
    const validation = CreateTransactionSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.format() },
        { status: 400 }
      )
    }
    const { customerId, paymentId, items: newItems } = validation.data

    // 2. Auth Check
    const cookieStore = cookies()
    const token = (await cookieStore).get("token")?.value
    const user = token ? await verifyJwt(token) : null
    if (!user)
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    const userId = user.user_id as string

    const result = await db.$transaction(async (tx) => {
      const oldTransaction = await tx.transactionHeader.findUnique({
        where: { transactionHeaderId: oldTransactionId },
        include: { transactionDetails: true },
      })

      if (!oldTransaction) throw new Error("Original transaction not found")
      if (oldTransaction.status === "VOID")
        throw new Error("Transaction already voided")

      // Revert Stock and IMEI for old items
      for (const item of oldTransaction.transactionDetails) {
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

      await tx.transactionHeader.update({
        where: { transactionHeaderId: oldTransactionId },
        data: { status: "VOID", modifiedById: userId },
      })

      let seqRecord = await tx.seqNo.findUnique({
        where: { name: "TRANSACTION" },
      })
      if (!seqRecord) {
        seqRecord = await tx.seqNo.create({
          data: { name: "TRANSACTION", format: "TRX-", seqno: 0 },
        })
      }
      const nextSeq = seqRecord.seqno + 1
      const newTrxId = `${seqRecord.format}${String(nextSeq).padStart(5, "0")}`

      await tx.seqNo.update({
        where: { name: "TRANSACTION" },
        data: { seqno: nextSeq },
      })

      const newHeader = await tx.transactionHeader.create({
        data: {
          transactionHeaderId: newTrxId,
          transactionDate: new Date(),
          paymentId,
          userId,
          createdById: userId,
          customerId: customerId || null,
          transactionMethod: "POS",
          status: "SUCCESS",
        },
      })

      for (const item of newItems) {
        const product = await tx.product.findUnique({
          where: { sku: item.sku },
        })
        if (!product) throw new Error(`Product not found: ${item.sku}`)
        if (product.quantity < item.quantity)
          throw new Error(`Insufficient stock for ${product.productName}`)

        if (item.imeiCode) {
          const imeiRecord = await tx.imei.findUnique({
            where: { imei: item.imeiCode },
          })
          if (!imeiRecord || imeiRecord.isSold || imeiRecord.sku !== item.sku) {
            throw new Error(`IMEI ${item.imeiCode} is invalid or sold`)
          }
          await tx.imei.update({
            where: { imei: item.imeiCode },
            data: { isSold: true },
          })
        }

        await tx.transactionDetail.create({
          data: {
            transactionHeaderId: newHeader.transactionHeaderId,
            sku: item.sku,
            quantity: item.quantity,
            price: item.price,
            imeiCode: item.imeiCode || null,
          },
        })

        await tx.product.update({
          where: { sku: item.sku },
          data: { quantity: { decrement: item.quantity } },
        })
      }

      return {
        oldId: oldTransactionId,
        newId: newHeader.transactionHeaderId,
        newHeader,
      }
    })

    return NextResponse.json({ success: true, data: result })
  } catch (error: any) {
    console.error("Void/Re-create failed:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Operation failed" },
      { status: 400 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAnyRole(request)
  if ("error" in auth) return auth.error

  try {
    const { id } = await params

    const cookieStore = cookies()
    const token = (await cookieStore).get("token")?.value
    const user = token ? await verifyJwt(token) : null

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const modifierId = user.user_id as string

    const result = await db.$transaction(async (tx) => {
      const transaction = await tx.transactionHeader.findUnique({
        where: { transactionHeaderId: id },
        include: { transactionDetails: true },
      })

      if (!transaction) throw new Error("Transaction not found")
      if (transaction.status === "VOID") throw new Error("Already voided")

      // 1. Revert Inventory
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

      return await tx.transactionHeader.update({
        where: { transactionHeaderId: id },
        data: {
          status: "VOID",
          modifiedById: modifierId,
        },
      })
    })

    return NextResponse.json({ success: true, data: result })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Void failed" },
      { status: 400 }
    )
  }
}
