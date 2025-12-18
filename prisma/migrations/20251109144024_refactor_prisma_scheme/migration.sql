/*
  Warnings:

  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `category_id` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `createdDate` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `modifiedBy` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `modifiedDate` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `ProductCategory` table. All the data in the column will be lost.
  - You are about to drop the column `modifiedBy` on the `ProductCategory` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `TransactionDetail` table. All the data in the column will be lost.
  - You are about to drop the column `skuId` on the `TransactionDetail` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `TransactionHeader` table. All the data in the column will be lost.
  - You are about to drop the `Inventory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductInventory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductSku` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SerialNumber` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Product` table without a default value. This is not possible if the table is not empty.
  - The required column `sku` was added to the `Product` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Made the column `brand` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `createdById` to the `ProductCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sku` to the `TransactionDetail` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_category_id_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_category_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductInventory" DROP CONSTRAINT "ProductInventory_inventory_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductInventory" DROP CONSTRAINT "ProductInventory_skuId_fkey";

-- DropForeignKey
ALTER TABLE "ProductSku" DROP CONSTRAINT "ProductSku_productId_fkey";

-- DropForeignKey
ALTER TABLE "SerialNumber" DROP CONSTRAINT "SerialNumber_skuId_fkey";

-- DropForeignKey
ALTER TABLE "TransactionDetail" DROP CONSTRAINT "TransactionDetail_product_id_fkey";

-- DropForeignKey
ALTER TABLE "TransactionDetail" DROP CONSTRAINT "TransactionDetail_skuId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP CONSTRAINT "Product_pkey",
DROP COLUMN "category_id",
DROP COLUMN "createdBy",
DROP COLUMN "createdDate",
DROP COLUMN "description",
DROP COLUMN "modifiedBy",
DROP COLUMN "modifiedDate",
DROP COLUMN "product_id",
ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "modifiedById" TEXT,
ADD COLUMN     "sku" TEXT NOT NULL,
ALTER COLUMN "brand" SET NOT NULL,
ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("sku");

-- AlterTable
ALTER TABLE "ProductCategory" DROP COLUMN "createdBy",
DROP COLUMN "modifiedBy",
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "modifiedById" TEXT;

-- AlterTable
ALTER TABLE "TransactionDetail" DROP COLUMN "product_id",
DROP COLUMN "skuId",
ADD COLUMN     "sku" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TransactionHeader" DROP COLUMN "totalPrice";

-- DropTable
DROP TABLE "Inventory";

-- DropTable
DROP TABLE "ProductInventory";

-- DropTable
DROP TABLE "ProductSku";

-- DropTable
DROP TABLE "SerialNumber";

-- CreateTable
CREATE TABLE "Imei" (
    "sku" TEXT NOT NULL,
    "imei" TEXT NOT NULL,

    CONSTRAINT "Imei_pkey" PRIMARY KEY ("sku","imei")
);

-- CreateTable
CREATE TABLE "ProductInventoryHeader" (
    "id" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "modifiedById" TEXT,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductInventoryHeader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductInventoryDetail" (
    "headerId" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "ProductInventoryDetail_pkey" PRIMARY KEY ("headerId","sku")
);

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_modifiedById_fkey" FOREIGN KEY ("modifiedById") REFERENCES "Users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ProductCategory"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_modifiedById_fkey" FOREIGN KEY ("modifiedById") REFERENCES "Users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imei" ADD CONSTRAINT "Imei_sku_fkey" FOREIGN KEY ("sku") REFERENCES "Product"("sku") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInventoryHeader" ADD CONSTRAINT "ProductInventoryHeader_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInventoryHeader" ADD CONSTRAINT "ProductInventoryHeader_modifiedById_fkey" FOREIGN KEY ("modifiedById") REFERENCES "Users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInventoryDetail" ADD CONSTRAINT "ProductInventoryDetail_headerId_fkey" FOREIGN KEY ("headerId") REFERENCES "ProductInventoryHeader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInventoryDetail" ADD CONSTRAINT "ProductInventoryDetail_sku_fkey" FOREIGN KEY ("sku") REFERENCES "Product"("sku") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionDetail" ADD CONSTRAINT "TransactionDetail_sku_fkey" FOREIGN KEY ("sku") REFERENCES "Product"("sku") ON DELETE RESTRICT ON UPDATE CASCADE;
