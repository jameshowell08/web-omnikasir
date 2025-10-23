import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Initialize the client for the seed script
const prisma = new PrismaClient();

async function main() {
    console.log("Start seeding...")

    const user = {
        userId: "US000",
        username: "admin",
        password: "admin123"
    }

    const insertedUser = await prisma.users.upsert({
        where: { user_id: user.userId },
        update: {},
        create: { user_id: user.userId, username: user.username, password: bcrypt.hashSync('admin123', 10) }
    })

    console.log(`Inserted user with these credentials: ${insertedUser.username} | ${insertedUser.password}`)
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });