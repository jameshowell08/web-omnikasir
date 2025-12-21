import { NextRequest, NextResponse } from "next/server"
import { db } from "../../../modules/shared/util/db"
import { z } from "zod"
import { Prisma } from "@prisma/client"
import { verifyJwt } from "@/src/modules/shared/util/auth"
import { cookies } from "next/headers"
import { requireAnyRole } from "@/src/modules/shared/middleware/auth"

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

export async function GET(req: NextRequest) {
  const auth = await requireAnyRole(req)
  if ("error" in auth) return auth.error
  try {
    const url = new URL(req.url)
    const { searchParams } = url

    const search = searchParams.get("search")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const paymentId = searchParams.get("paymentId")

    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const whereClause: Prisma.TransactionHeaderWhereInput = {
      ...(paymentId && { paymentId }),
      ...(startDate &&
        endDate && {
          transactionDate: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }),
      ...(search && {
        OR: [
          { transactionHeaderId: { contains: search, mode: "insensitive" } },
          {
            customer: {
              customerName: { contains: search, mode: "insensitive" },
            },
          },
        ],
      }),
    }

    const [total, transactions] = await db.$transaction([
      db.transactionHeader.count({ where: whereClause }),
      db.transactionHeader.findMany({
        where: whereClause,
        take: limit,
        skip: skip,
        include: {
          customer: { select: { customerName: true } },
          paymentMethod: { select: { paymentName: true } },
          user: { select: { username: true } },
          createdBy: { select: { username: true } },
          transactionDetails: {
            include: {
              product: { select: { productName: true, brand: true } },
            },
          },
        },
        orderBy: { transactionDate: "desc" },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: transactions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch transactions" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAnyRole(req)
  if ("error" in auth) return auth.error
  try {
    // 1. Auth Check
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
    const userId = user.user_id as string

    const body = await req.json()
    const validation = CreateTransactionSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.format() },
        { status: 400 }
      )
    }

    const { customerId, paymentId, items } = validation.data

    const result = await db.$transaction(async (tx) => {
      let seqRecord = await tx.seqNo.findUnique({
        where: { name: "TRANSACTION" },
      })

      if (!seqRecord) {
        seqRecord = await tx.seqNo.create({
          data: { name: "TRANSACTION", format: "TRX-", seqno: 0 },
        })
      }

      const nextSeq = seqRecord.seqno + 1
      const trxId = `${seqRecord.format}${String(nextSeq).padStart(5, "0")}`

      await tx.seqNo.update({
        where: { name: "TRANSACTION" },
        data: { seqno: nextSeq },
      })

      const header = await tx.transactionHeader.create({
        data: {
          transactionHeaderId: trxId,
          transactionDate: new Date(),
          paymentId,
          userId,
          createdById: userId,
          customerId: customerId || null,
          transactionMethod: "POS",
          status: "SUCCESS",
        },
      })

      for (const item of items) {
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

          if (!imeiRecord) throw new Error(`IMEI not found: ${item.imeiCode}`)
          if (imeiRecord.sku !== item.sku)
            throw new Error(`IMEI mismatch for SKU ${item.sku}`)
          if (imeiRecord.isSold)
            throw new Error(`IMEI ${item.imeiCode} is already sold!`)

          await tx.imei.update({
            where: { imei: item.imeiCode },
            data: { isSold: true },
          })
        }

        await tx.transactionDetail.create({
          data: {
            transactionHeaderId: header.transactionHeaderId,
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

      return header
    })

    return NextResponse.json({ success: true, data: result })
  } catch (error: any) {
    console.error("Transaction failed:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Transaction failed" },
      { status: 400 }
    )
  }
}
