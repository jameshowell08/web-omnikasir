-- AlterTable
ALTER TABLE "inventory" ADD COLUMN     "category_id" TEXT;

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "itemCategory"("category_id") ON DELETE SET NULL ON UPDATE CASCADE;
