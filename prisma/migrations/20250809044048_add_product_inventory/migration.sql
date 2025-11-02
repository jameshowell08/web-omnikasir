-- CreateTable
CREATE TABLE "productInventory" (
    "inventory_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" BIGINT NOT NULL,

    CONSTRAINT "productInventory_pkey" PRIMARY KEY ("inventory_id","product_id")
);

-- AddForeignKey
ALTER TABLE "productInventory" ADD CONSTRAINT "productInventory_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "inventory"("inventory_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productInventory" ADD CONSTRAINT "productInventory_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;
