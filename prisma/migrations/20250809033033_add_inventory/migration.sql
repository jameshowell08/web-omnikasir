-- CreateTable
CREATE TABLE "inventory" (
    "inventory_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "note" TEXT NOT NULL,

    CONSTRAINT "inventory_pkey" PRIMARY KEY ("inventory_id")
);
