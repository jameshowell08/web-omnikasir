/*
  Warnings:

  - Added the required column `isNeedImei` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "isNeedImei" BOOLEAN NOT NULL;
