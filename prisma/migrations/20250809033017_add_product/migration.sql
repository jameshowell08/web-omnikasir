-- CreateTable
CREATE TABLE "product" (
    "product_id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "productPrice" DOUBLE PRECISION NOT NULL,
    "productQuantity" INTEGER NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("product_id")
);
