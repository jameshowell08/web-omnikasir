import { NextRequest, NextResponse } from "next/server"
import { db } from "../../../modules/shared/util/db"
import { z } from "zod"
import { Prisma } from "@prisma/client"
import { verifyJwt } from "@/src/modules/shared/util/auth"
import { cookies } from "next/headers"
import { requireAnyRole } from "@/src/modules/shared/middleware/auth"

const CustomerSchema = z.object({
  customerName: z.string().min(1, "Name is required").max(255),
  customerEmail: z.string().email().optional().or(z.literal("")),
  customerPhoneNumber: z.string().max(20).optional().or(z.literal("")),
  customerAddress: z.string().optional().or(z.literal("")),
  isActive: z.boolean().optional().default(true),
})

export async function GET(req: NextRequest) {
  const auth = await requireAnyRole()
  if ("error" in auth) return auth.error

  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search")
    const customerId = searchParams.get("customerId")
    const isActiveParam = searchParams.get("isActive")

    // Check if client wants all data (e.g. ?limit=0)
    const limitParam = searchParams.get("limit")
    const shouldFetchAll = limitParam === "0"

    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(limitParam || "10")
    const skip = (page - 1) * limit

    const whereClause: Prisma.CustomerWhereInput = {
      ...(customerId && {
        customerId: { contains: customerId, mode: "insensitive" },
      }),
      ...(isActiveParam !== null && {
        isActive: isActiveParam === "true",
      }),
      ...(search && {
        OR: [
          { customerId: { contains: search, mode: "insensitive" } },
          { customerName: { contains: search, mode: "insensitive" } },
          { customerEmail: { contains: search, mode: "insensitive" } },
          { customerPhoneNumber: { contains: search, mode: "insensitive" } },
        ],
      }),
    }

    const findManyArgs: Prisma.CustomerFindManyArgs = {
      where: whereClause,
      orderBy: { createdAt: "desc" },
    }

    if (!shouldFetchAll) {
      findManyArgs.take = limit
      findManyArgs.skip = skip
    }

    const [total, customers] = await db.$transaction([
      db.customer.count({ where: whereClause }),
      db.customer.findMany(findManyArgs),
    ])

    return NextResponse.json({
      success: true,
      data: customers,
      meta: {
        total,
        page: shouldFetchAll ? 1 : page,
        limit: shouldFetchAll ? total : limit,
        totalPages: shouldFetchAll ? 1 : Math.ceil(total / limit),
      },
    })
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data customer" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAnyRole()
  if ("error" in auth) return auth.error
  try {
    // 1. AUTHENTICATION
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    if (!token || !(await verifyJwt(token))) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validation = CustomerSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.format() },
        { status: 400 }
      )
    }

    const {
      customerName,
      customerEmail,
      customerPhoneNumber,
      customerAddress,
      isActive,
    } = validation.data

    const firstLetter = customerName.charAt(0).toUpperCase()
    const seqKey = `CUST_${firstLetter}`

    const result = await db.$transaction(async (tx) => {
      const sequence = await tx.seqNo.upsert({
        where: { name: seqKey },
        update: { seqno: { increment: 1 } },
        create: {
          name: seqKey,
          format: `${firstLetter}-####`,
          seqno: 1,
        },
      })

      // Generate ID like "a-0001"
      const formattedId = `${firstLetter.toUpperCase()}-${String(
        sequence.seqno
      ).padStart(4, "0")}`

      return await tx.customer.create({
        data: {
          customerId: formattedId,
          customerName,
          customerEmail: customerEmail || null,
          customerPhoneNumber: customerPhoneNumber || null,
          customerAddress: customerAddress || null,
          isActive,
        },
      })
    })

    return NextResponse.json({
      success: true,
      data: JSON.parse(
        JSON.stringify(result, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      ),
    })
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
    console.error("Error creating customer:", error)
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
