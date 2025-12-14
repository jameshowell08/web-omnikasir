/*
  Warnings:

  - Added the required column `created_by` to the `TransactionHeader` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modifiedDate` to the `TransactionHeader` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TransactionHeader" ADD COLUMN     "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by" TEXT NOT NULL,
ADD COLUMN     "modifiedDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "modified_by" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'SUCCESS';

-- AddForeignKey
ALTER TABLE "TransactionHeader" ADD CONSTRAINT "TransactionHeader_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionHeader" ADD CONSTRAINT "TransactionHeader_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "Users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
