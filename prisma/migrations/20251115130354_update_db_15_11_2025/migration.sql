/*
  Warnings:

  - The primary key for the `Imei` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `quantity` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellingPrice` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Imei" DROP CONSTRAINT "Imei_pkey",
ADD COLUMN     "isSold" BOOLEAN NOT NULL DEFAULT false,
ADD CONSTRAINT "Imei_pkey" PRIMARY KEY ("imei");

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "buyingPrice" DECIMAL(12,2),
ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "sellingPrice" DECIMAL(12,2) NOT NULL;

-- AlterTable
ALTER TABLE "ProductInventoryDetail" ADD COLUMN     "imeiCode" TEXT;

-- AlterTable
ALTER TABLE "TransactionDetail" ADD COLUMN     "imeiCode" TEXT;

-- AddForeignKey
ALTER TABLE "ProductInventoryDetail" ADD CONSTRAINT "ProductInventoryDetail_imeiCode_fkey" FOREIGN KEY ("imeiCode") REFERENCES "Imei"("imei") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionDetail" ADD CONSTRAINT "TransactionDetail_imeiCode_fkey" FOREIGN KEY ("imeiCode") REFERENCES "Imei"("imei") ON DELETE SET NULL ON UPDATE CASCADE;
