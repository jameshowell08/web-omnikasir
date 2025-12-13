/*
  Warnings:

  - You are about to drop the column `productSku` on the `ProductInventoryDetail` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductInventoryDetail" DROP CONSTRAINT "ProductInventoryDetail_productSku_fkey";

-- AlterTable
ALTER TABLE "ProductInventoryDetail" DROP COLUMN "productSku";

-- AddForeignKey
ALTER TABLE "ProductInventoryDetail" ADD CONSTRAINT "ProductInventoryDetail_sku_fkey" FOREIGN KEY ("sku") REFERENCES "Product"("sku") ON DELETE RESTRICT ON UPDATE CASCADE;
