/*
  Warnings:

  - The primary key for the `UserAccess` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `user_id` on the `UserAccess` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `access` on the `UserAccess` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - Made the column `created_date` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- DropForeignKey
ALTER TABLE "UserAccess" DROP CONSTRAINT "UserAccess_user_id_fkey";

-- AlterTable
ALTER TABLE "UserAccess" DROP CONSTRAINT "UserAccess_pkey",
ADD COLUMN     "granted_by" VARCHAR(255),
ADD COLUMN     "granted_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "user_id" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "access" SET DATA TYPE VARCHAR(100),
ADD CONSTRAINT "UserAccess_pkey" PRIMARY KEY ("user_id", "access");

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "last_login" TIMESTAMP(6),
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER',
ALTER COLUMN "created_date" SET NOT NULL;

-- CreateIndex
CREATE INDEX "UserAccess_user_id_idx" ON "UserAccess"("user_id");

-- AddForeignKey
ALTER TABLE "UserAccess" ADD CONSTRAINT "UserAccess_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
