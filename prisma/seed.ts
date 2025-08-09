import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import fs from "fs"
import path from "path"

const prisma = new PrismaClient()

async function main() {
  //--users seed --
  const passwordHash = bcrypt.hashSync("admin123", 10)
  await prisma.users.upsert({
    where: { user_id: "US000" },
    update: {},
    create: {
      user_id: "US000",
      username: "admin",
      password: passwordHash,
    },
  })
  //--store seed-
  const imagePath = path.join(__dirname, "assets", "walpaper.png")

  const imageBuffer = fs.readFileSync(imagePath) // Load image as buffer

  await prisma.store.upsert({
    where: { id: "dummy-store-1" },
    update: {},
    create: {
      id: "dummy-store-1", // use any fixed UUID string or remove this to let it autogenerate
      nama: "Toko Dummy",
      alamat: "Jl. Contoh No. 123",
      noHp: "081234567890",
      profilePicture: imageBuffer,
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
