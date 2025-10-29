import { db } from "../../../../lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nama, alamat, noHp, profilePicture } = body

    // Validasi sederhana
    if (!nama || !alamat || !noHp) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      )
    }

    let profilePictureBuffer: Buffer | undefined = undefined

    if (profilePicture) {
      // Strip "data:image/jpeg;base64," if included
      const base64Data = profilePicture.split(",").pop()
      profilePictureBuffer = Buffer.from(base64Data!, "base64")
    }

    const newStore = await db.store.create({
      data: {
        nama,
        alamat,
        noHp,
        profilePicture: profilePictureBuffer,
      },
    })

    return NextResponse.json(
      { message: "Store created", data: newStore },
      { status: 201 }
    )
  } catch (error) {
    console.error("Create store error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
