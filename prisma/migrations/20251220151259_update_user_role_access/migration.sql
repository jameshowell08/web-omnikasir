/*
  Warnings:

  - The values [USER] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `UserAccess` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('ADMIN', 'CASHIER');
ALTER TABLE "public"."Users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "Users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
ALTER TABLE "Users" ALTER COLUMN "role" SET DEFAULT 'CASHIER';
COMMIT;

-- DropForeignKey
ALTER TABLE "UserAccess" DROP CONSTRAINT "UserAccess_user_id_fkey";

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "role" SET DEFAULT 'CASHIER';

-- DropTable
DROP TABLE "UserAccess";
