import { db } from "@/src/lib/db"
import { NextResponse } from "next/server"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const storeId = await params.id

  try {
    const body = await request.json()
    const { nama, alamat, noHp } = body

    const updatedStore = await db.store.update({
      where: { id: storeId },
      data: {
        ...(nama && { nama }),
        ...(alamat && { alamat }),
        ...(noHp && { noHp })
      },
    })

    return NextResponse.json({ message: "Store updated", data: updatedStore })
  } catch (error: unknown) {
    console.error("Update store error:", error)
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Failed to update store", detail: error.message },
        { status: 500 }
      )
    } else {
      return NextResponse.json(
        { error: "Failed to update store" },
        { status: 500 }
      )
    }
  }
}
