import { db } from "../../../../modules/shared/util/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nama, alamat, noHp, profilePicture } = body

    if (!nama || !alamat || !noHp) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 })
    }

    let profilePictureBuffer: Buffer | null = null

    if (profilePicture && typeof profilePicture === "string") {
      const base64Data = profilePicture.includes(",") ? profilePicture.split(",").pop() : profilePicture
      if (base64Data) {
        profilePictureBuffer = Buffer.from(base64Data, "base64")
      }
    }

    const newStore = await db.store.create({
      data: {
        nama,
        alamat,
        noHp,
        profilePicture: profilePictureBuffer,
      },
    })

    const responseData = {
      ...newStore,
      profilePicture: newStore.profilePicture
        ? Buffer.from(newStore.profilePicture).toString("base64")
        : null,
    }

    return NextResponse.json({ message: "Store created", data: responseData }, { status: 201 })
  } catch (error) {
    console.error("Create store error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}