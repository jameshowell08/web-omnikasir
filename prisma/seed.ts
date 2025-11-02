import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Start seeding...")

  // ✅ Correct seq_no upsert
  const insertedSeqNo = await prisma.seqNo.upsert({
    where: { name: "user_id" }, // name is unique
    update: {},
    create: {
      name: "user_id",
      format: "US",
      seqno: 1,
    },
  })

  console.log(`Inserted seqNo: ${insertedSeqNo.name}`)

  // ✅ Correct user upsert
  const insertedUser = await prisma.users.upsert({
    where: { userId: "US000" }, // use Prisma field name
    update: {},
    create: {
      userId: "US000",
      username: "admin",
      password: bcrypt.hashSync("admin123", 10),
    },
  })

  console.log(`Inserted user: ${insertedUser.username}`)
}

main()
  .catch((e) => {
    console.error("Error seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
