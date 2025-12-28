import { NextRequest, NextResponse } from "next/server"
import { db } from "../../../modules/shared/util/db"
import { z } from "zod"
import { Prisma, UserRole } from "@prisma/client"
import { verifyJwt } from "@/src/modules/shared/util/auth"
import { cookies } from "next/headers"
import {
  requireAdmin,
  requireAnyRole,
} from "@/src/modules/shared/middleware/auth"
import bcrypt from "bcryptjs"

const UserSchema = z.object({
  username: z
    .string()
    .min(5, "Username must be at least 5 characters")
    .max(255),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.nativeEnum(UserRole).optional().default(UserRole.CASHIER),
  isActive: z.boolean().optional().default(true),
})

export async function GET(req: NextRequest) {
  const auth = await requireAnyRole(req)
  if ("error" in auth) return auth.error

  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search")
    const roleParam = searchParams.get("role") as UserRole | null
    const isActiveParam = searchParams.get("isActive")

    const limitParam = searchParams.get("limit")
    const shouldFetchAll = limitParam === "0"

    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(limitParam || "10")
    const skip = (page - 1) * limit

    const whereClause: Prisma.UsersWhereInput = {
      ...(roleParam && { role: roleParam }),
      ...(isActiveParam !== null && {
        isActive: isActiveParam === "true",
      }),
      ...(search && {
        OR: [
          { userId: { contains: search, mode: "insensitive" } },
          { username: { contains: search, mode: "insensitive" } },
        ],
      }),
    }

    const findManyArgs: Prisma.UsersFindManyArgs = {
      where: whereClause,
      orderBy: { createdDate: "desc" },
      // Exclude password from the results
      select: {
        userId: true,
        username: true,
        role: true,
        isActive: true,
        createdDate: true,
        lastLogin: true,
      },
    }

    if (!shouldFetchAll) {
      findManyArgs.take = limit
      findManyArgs.skip = skip
    }

    const [total, users] = await db.$transaction([
      db.users.count({ where: whereClause }),
      db.users.findMany(findManyArgs),
    ])

    return NextResponse.json({
      success: true,
      data: users,
      meta: {
        total,
        page: shouldFetchAll ? 1 : page,
        limit: shouldFetchAll ? total : limit,
        totalPages: shouldFetchAll ? 1 : Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data user" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if ("error" in auth) return auth.error

  try {
    const body = await req.json()
    const validation = UserSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.format() },
        { status: 400 }
      )
    }

    const { username, password, role, isActive } = validation.data

    const hashedPassword = await bcrypt.hash(password, 10)

    // Sequence Key for Users (e.g., USR-0001)
    const seqKey = "USER_SEQUENCE"

    const result = await db.$transaction(async (tx) => {
      const sequence = await tx.seqNo.upsert({
        where: { name: seqKey },
        update: { seqno: { increment: 1 } },
        create: {
          name: seqKey,
          format: "US-####",
          seqno: 1,
        },
      })

      const formattedId = `US-${String(sequence.seqno).padStart(4, "0")}`

      return await tx.users.create({
        data: {
          userId: formattedId,
          username,
          password: hashedPassword,
          role,
          isActive,
        },
        select: {
          userId: true,
          username: true,
          role: true,
          isActive: true,
          createdDate: true,
        },
      })
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          message: "Username sudah terdaftar",
        },
        { status: 400 }
      )
    }
    console.error("Error creating user:", error)
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
