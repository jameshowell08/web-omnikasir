/*
  Warnings:

  - You are about to drop the `customer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inventory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `itemCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `paymentMethod` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `productInventory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `seq_no` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `store` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transactionDetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transactionHeader` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userAccess` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "inventory" DROP CONSTRAINT "inventory_category_id_fkey";

-- DropForeignKey
ALTER TABLE "productInventory" DROP CONSTRAINT "productInventory_inventory_id_fkey";

-- DropForeignKey
ALTER TABLE "productInventory" DROP CONSTRAINT "productInventory_product_id_fkey";

-- DropForeignKey
ALTER TABLE "transactionDetail" DROP CONSTRAINT "transactionDetail_product_id_fkey";

-- DropForeignKey
ALTER TABLE "transactionDetail" DROP CONSTRAINT "transactionDetail_transactionHeaderID_fkey";

-- DropForeignKey
ALTER TABLE "transactionHeader" DROP CONSTRAINT "transactionHeader_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "transactionHeader" DROP CONSTRAINT "transactionHeader_payment_id_fkey";

-- DropForeignKey
ALTER TABLE "transactionHeader" DROP CONSTRAINT "transactionHeader_user_id_fkey";

-- DropForeignKey
ALTER TABLE "userAccess" DROP CONSTRAINT "userAccess_user_id_fkey";

-- DropTable
DROP TABLE "customer";

-- DropTable
DROP TABLE "inventory";

-- DropTable
DROP TABLE "itemCategory";

-- DropTable
DROP TABLE "paymentMethod";

-- DropTable
DROP TABLE "product";

-- DropTable
DROP TABLE "productInventory";

-- DropTable
DROP TABLE "seq_no";

-- DropTable
DROP TABLE "store";

-- DropTable
DROP TABLE "transactionDetail";

-- DropTable
DROP TABLE "transactionHeader";

-- DropTable
DROP TABLE "userAccess";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "Users" (
    "user_id" VARCHAR(255) NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "created_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "SeqNo" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "format" VARCHAR(10) NOT NULL,
    "seqno" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SeqNo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "noHp" TEXT NOT NULL,
    "profilePicture" BYTEA,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "customer_id" TEXT NOT NULL,
    "customerName" VARCHAR(255) NOT NULL,
    "customerPhoneNumber" TEXT,
    "created_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("customer_id")
);

-- CreateTable
CREATE TABLE "ProductCategory" (
    "category_id" TEXT NOT NULL,
    "category_name" TEXT NOT NULL,
    "description" TEXT,
    "createdBy" TEXT,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedBy" TEXT,
    "modifiedDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "Product" (
    "product_id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "brand" TEXT,
    "description" TEXT,
    "category_id" TEXT,
    "createdBy" TEXT,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedBy" TEXT,
    "modifiedDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "ProductSku" (
    "skuId" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "barcode" TEXT,
    "priceSell" DECIMAL(12,2) NOT NULL,
    "priceBuy" DECIMAL(12,2),
    "attributes" JSONB,
    "serialRequired" BOOLEAN NOT NULL DEFAULT false,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductSku_pkey" PRIMARY KEY ("skuId")
);

-- CreateTable
CREATE TABLE "ProductInventory" (
    "id" TEXT NOT NULL,
    "skuId" TEXT NOT NULL,
    "inventory_id" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "reserved" INTEGER NOT NULL DEFAULT 0,
    "inTransit" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductInventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SerialNumber" (
    "serialId" TEXT NOT NULL,
    "skuId" TEXT NOT NULL,
    "serialNo" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'IN_STOCK',
    "soldAt" TIMESTAMP(3),
    "soldTo" TEXT,
    "warrantyUntil" TIMESTAMP(3),
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SerialNumber_pkey" PRIMARY KEY ("serialId")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "inventory_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "category_id" TEXT,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("inventory_id")
);

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "payment_id" TEXT NOT NULL,
    "paymentName" TEXT NOT NULL,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("payment_id")
);

-- CreateTable
CREATE TABLE "UserAccess" (
    "user_id" TEXT NOT NULL,
    "access" TEXT NOT NULL,

    CONSTRAINT "UserAccess_pkey" PRIMARY KEY ("user_id","access")
);

-- CreateTable
CREATE TABLE "TransactionHeader" (
    "transactionHeaderID" VARCHAR(255) NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "totalPrice" DECIMAL(12,2) NOT NULL,
    "payment_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "transactionMethod" VARCHAR(255) NOT NULL,
    "customer_id" TEXT NOT NULL,

    CONSTRAINT "TransactionHeader_pkey" PRIMARY KEY ("transactionHeaderID")
);

-- CreateTable
CREATE TABLE "TransactionDetail" (
    "transactionDetailID" VARCHAR(255) NOT NULL,
    "transactionHeaderID" TEXT NOT NULL,
    "skuId" TEXT,
    "product_id" TEXT,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "TransactionDetail_pkey" PRIMARY KEY ("transactionDetailID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "SeqNo_name_key" ON "SeqNo"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_customerName_key" ON "Customer"("customerName");

-- CreateIndex
CREATE UNIQUE INDEX "ProductSku_sku_key" ON "ProductSku"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "ProductSku_barcode_key" ON "ProductSku"("barcode");

-- CreateIndex
CREATE UNIQUE INDEX "ux_sku_inventory" ON "ProductInventory"("skuId", "inventory_id");

-- CreateIndex
CREATE UNIQUE INDEX "SerialNumber_serialNo_key" ON "SerialNumber"("serialNo");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "ProductCategory"("category_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSku" ADD CONSTRAINT "ProductSku_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInventory" ADD CONSTRAINT "ProductInventory_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "ProductSku"("skuId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInventory" ADD CONSTRAINT "ProductInventory_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "Inventory"("inventory_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SerialNumber" ADD CONSTRAINT "SerialNumber_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "ProductSku"("skuId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "ProductCategory"("category_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAccess" ADD CONSTRAINT "UserAccess_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionHeader" ADD CONSTRAINT "TransactionHeader_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "PaymentMethod"("payment_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionHeader" ADD CONSTRAINT "TransactionHeader_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionHeader" ADD CONSTRAINT "TransactionHeader_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionDetail" ADD CONSTRAINT "TransactionDetail_transactionHeaderID_fkey" FOREIGN KEY ("transactionHeaderID") REFERENCES "TransactionHeader"("transactionHeaderID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionDetail" ADD CONSTRAINT "TransactionDetail_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "ProductSku"("skuId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionDetail" ADD CONSTRAINT "TransactionDetail_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE SET NULL ON UPDATE CASCADE;
