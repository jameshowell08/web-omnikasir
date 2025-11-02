-- CreateTable
CREATE TABLE "transactionDetail" (
    "transactionDetailID" VARCHAR(255) NOT NULL,
    "transactionHeaderID" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" VARCHAR(255) NOT NULL,

    CONSTRAINT "transactionDetail_pkey" PRIMARY KEY ("transactionDetailID")
);

-- AddForeignKey
ALTER TABLE "transactionDetail" ADD CONSTRAINT "transactionDetail_transactionHeaderID_fkey" FOREIGN KEY ("transactionHeaderID") REFERENCES "transactionHeader"("transactionHeaderID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactionDetail" ADD CONSTRAINT "transactionDetail_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;
