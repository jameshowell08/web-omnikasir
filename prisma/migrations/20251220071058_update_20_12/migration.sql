/*
  Warnings:

  - You are about to drop the column `created_date` on the `Customer` table. All the data in the column will be lost.
  - You are about to alter the column `customerPhoneNumber` on the `Customer` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - A unique constraint covering the columns `[customerEmail]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[customerPhoneNumber]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "created_date",
ADD COLUMN     "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "customerAddress" TEXT,
ADD COLUMN     "customerEmail" VARCHAR(255),
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL,
ALTER COLUMN "customerPhoneNumber" SET DATA TYPE VARCHAR(20);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_customerEmail_key" ON "Customer"("customerEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_customerPhoneNumber_key" ON "Customer"("customerPhoneNumber");
