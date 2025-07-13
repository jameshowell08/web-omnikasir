import { prisma } from '../db';
import bcrypt from 'bcryptjs';

// Function to add default user
export async function createUser() {
  const passwordHash = bcrypt.hashSync('admin123', 10);
  await prisma.users.create({
    data: {
      user_id: 'US000',
      username: 'admin',
      password: passwordHash,
    },
  });
  console.log('User created');
}