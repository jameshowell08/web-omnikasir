-- AlterTable
ALTER TABLE "ProductInventoryHeader" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "totalAmount" DECIMAL(12,2);
