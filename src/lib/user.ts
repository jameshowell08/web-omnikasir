import { prisma } from "./db"

export async function generateUserId(): Promise<string> {
  return await prisma.$transaction(async (tx) => {
    const sequence = await tx.seq_no.findUnique({
      where: { name: "user_id" },
    })

    if (!sequence) {
      throw new Error("Missing sequence entry for 'user_id'")
    }

    const nextSeq = sequence.seqno + 1

    await tx.seq_no.update({
      where: { name: "user_id" },
      data: { seqno: nextSeq },
    })

    const formatted = `${sequence.format}${String(nextSeq).padStart(3, "0")}`
    return formatted // e.g. US001
  })
}
