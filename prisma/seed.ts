import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const passwordHash = bcrypt.hashSync('admin123', 10);
    const admin = await prisma.users.upsert({
        where: { user_id: "US000" },
        update: {},
        create: {
            user_id: "US000",
            username: "admin",
            password: passwordHash
        }
    })
    console.log(admin)
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