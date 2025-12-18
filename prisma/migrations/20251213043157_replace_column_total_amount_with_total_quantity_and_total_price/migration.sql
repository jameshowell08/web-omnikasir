/*
  Warnings:

  - You are about to drop the column `totalAmount` on the `ProductInventoryHeader` table. All the data in the column will be lost.
  - Added the required column `totalQuantity` to the `ProductInventoryHeader` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductInventoryHeader" DROP COLUMN "totalAmount",
ADD COLUMN     "totalPrice" DECIMAL(12,2),
ADD COLUMN     "totalQuantity" INTEGER NOT NULL;
