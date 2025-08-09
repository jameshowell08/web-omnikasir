-- CreateTable
CREATE TABLE "customer" (
    "customer_id" TEXT NOT NULL,
    "customerName" VARCHAR(255) NOT NULL,
    "customerPhoneNumber" TEXT NOT NULL,
    "created_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("customer_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customer_customerName_key" ON "customer"("customerName");
