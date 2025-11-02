-- CreateTable
CREATE TABLE "transactionHeader" (
    "transactionHeaderID" VARCHAR(255) NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "totalPrice" VARCHAR(255) NOT NULL,
    "payment_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "transactionMethod" VARCHAR(255) NOT NULL,
    "customer_id" TEXT NOT NULL,

    CONSTRAINT "transactionHeader_pkey" PRIMARY KEY ("transactionHeaderID")
);

-- AddForeignKey
ALTER TABLE "transactionHeader" ADD CONSTRAINT "transactionHeader_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "paymentMethod"("payment_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactionHeader" ADD CONSTRAINT "transactionHeader_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactionHeader" ADD CONSTRAINT "transactionHeader_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;
