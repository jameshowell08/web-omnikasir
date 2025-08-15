import { db } from "@/src/lib/db";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: {id: string} }) {
  const { id } = await params

  const storeData = await db.store.findUnique({
    where: { id: id },
    select: { profilePicture: true }
  });

  if (!storeData?.profilePicture) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  const imageBuffer = new Uint8Array(storeData.profilePicture);

  return new NextResponse(imageBuffer, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Content-Length": imageBuffer.byteLength.toString()
    }
  });
}
