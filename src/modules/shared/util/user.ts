import { getCookie } from "./CookieUtil"
import { prisma } from "./db"

export async function generateUserId(): Promise<string> {
  return await prisma.$transaction(async (tx) => {
    const sequence = await tx.seqNo.findUnique({
      where: { name: "user_id" },
    })

    if (!sequence) {
      throw new Error("Missing sequence entry for 'user_id'")
    }

    const nextSeq = sequence.seqno + 1

    await tx.seqNo.update({
      where: { name: "user_id" },
      data: { seqno: nextSeq },
    })

    const formatted = `${sequence.format}${String(nextSeq).padStart(3, "0")}`
    return formatted // e.g. US001
  })
}

export class User {
  constructor(
    public username: string,
    public userId: string,
    public role: string
  ) {}
}

export function getUser(): User | null {
  const user = getCookie("user");
  if (!user) {
    return null;
  }
  return JSON.parse(user);
}
