import { db } from "../../../../modules/shared/util/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ message: "Store ID is required" }, { status: 400 })
  }

  try {
    const store = await db.store.findUnique({
      where: { id },
      select: {
        nama: true,
        alamat: true,
        noHp: true,
        profilePicture: true,
      },
    })

    if (!store) {
      return NextResponse.json({ message: "Store not found" }, { status: 404 })
    }
    let base64Image: string | null = null

    if (store.profilePicture) {
      const buffer = Buffer.from(store.profilePicture)
      base64Image = `data:image/png;base64,${buffer.toString("base64")}`
    }

    return NextResponse.json({
      nama: store.nama,
      alamat: store.alamat,
      noHp: store.noHp,
      profilePicture: base64Image,
    })
  } catch (error) {
    console.error("Error fetching store:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
