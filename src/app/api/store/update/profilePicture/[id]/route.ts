import { db } from "../../../../../lib/db"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params

  try {
    const store = await db.store.findUnique({
      where: { id },
      select: {
        nama: true,
        alamat: true,
        noHp: true
      },
    })

    if (!store) {
      return NextResponse.json({ message: "Store not found" }, { status: 404 })
    }

    return NextResponse.json({
      storeName: store.nama,
      address: store.alamat,
      phoneNumber: store.noHp,
      profilePictureUrl: "/api/store/get/profilePicture/" + id,
    })
  } catch (error) {
    console.error("Error fetching store:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
