-- DropForeignKey
ALTER TABLE "TransactionHeader" DROP CONSTRAINT "TransactionHeader_customer_id_fkey";

-- AlterTable
ALTER TABLE "TransactionHeader" ALTER COLUMN "customer_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "TransactionHeader" ADD CONSTRAINT "TransactionHeader_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("customer_id") ON DELETE SET NULL ON UPDATE CASCADE;
