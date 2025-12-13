import { db } from "../../../../modules/shared/util/db"
import { NextResponse } from "next/server"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const storeId = params.id

  try {
    const body = await request.json()
    const { nama, alamat, noHp, profilePicture } = body
    let pictureBuffer: Buffer | undefined = undefined

    if (profilePicture) {
      // Remove the prefix if it's a full data URI
      const base64 = profilePicture.split(",")?.[1] || profilePicture
      pictureBuffer = Buffer.from(base64, "base64")
    }
    const updatedStore = await db.store.update({
      where: { id: storeId },
      data: {
        ...(nama && { nama }),
        ...(alamat && { alamat }),
        ...(noHp && { noHp }),
        ...(pictureBuffer && { profilePicture: pictureBuffer }),
      },
    })

    return NextResponse.json({ message: "Store updated", data: updatedStore })
  } catch (error: any) {
    console.error("Update store error:", error)
    return NextResponse.json(
      { error: "Failed to update store", detail: error.message },
      { status: 500 }
    )
  }
}
