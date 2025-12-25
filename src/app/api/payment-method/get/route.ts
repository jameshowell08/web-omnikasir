// app/api/payment-methods/route.ts
import { NextRequest, NextResponse } from "next/server"
import { db } from "../../../../modules/shared/util/db"
import {
  requireAdmin,
  requireAnyRole,
} from "@/src/modules/shared/middleware/auth"

export async function GET(req: NextRequest) {
  const auth = await requireAnyRole(req)
  if ("error" in auth) return auth.error
  try {
    const url = new URL(req.url)

    const usePaging = url.searchParams.get("usePaging") !== "false"

    const search = url.searchParams.get("search") || ""
    const page = Number(url.searchParams.get("page")) || 1
    const limit = Number(url.searchParams.get("limit")) || 10

    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.paymentName = {
        contains: search,
        mode: "insensitive",
      }
    }

    if (!usePaging) {
      const paymentMethods = await db.paymentMethod.findMany({
        where,
        orderBy: {
          paymentName: "asc",
        },
        select: {
          paymentId: true,
          paymentName: true,
        },
      })

      return NextResponse.json({
        status: true,
        data: paymentMethods,
      })
    }

    const paymentMethods = await db.paymentMethod.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        paymentName: "asc",
      },
      include: {
        _count: {
          select: { transactionHeaders: true },
        },
      },
    })

    const totalRows = await db.paymentMethod.count({ where })
    const totalPages = limit > 0 ? Math.ceil(totalRows / limit) : 0

    const data = paymentMethods.map((pm) => ({
      paymentId: pm.paymentId,
      paymentName: pm.paymentName,
      totalTransactions: pm._count.transactionHeaders,
    }))

    return NextResponse.json({
      status: true,
      page,
      limit,
      totalRows,
      totalPages,
      data,
    })
  } catch (error) {
    console.error("Get Payment Methods API Error:", error)
    return NextResponse.json(
      { status: false, message: "Failed to fetch payment methods" },
      { status: 500 }
    )
  }
}
