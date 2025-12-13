-- DropForeignKey
ALTER TABLE "ProductInventoryDetail" DROP CONSTRAINT "ProductInventoryDetail_sku_fkey";

-- AlterTable
ALTER TABLE "ProductInventoryDetail" ADD COLUMN     "productSku" TEXT;

-- AddForeignKey
ALTER TABLE "ProductInventoryDetail" ADD CONSTRAINT "ProductInventoryDetail_productSku_fkey" FOREIGN KEY ("productSku") REFERENCES "Product"("sku") ON DELETE SET NULL ON UPDATE CASCADE;
