-- CreateTable
CREATE TABLE "users" (
    "user_id" VARCHAR(255) NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "created_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "seq_no" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "format" VARCHAR(10) NOT NULL,
    "seqno" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "seq_no_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "seq_no_name_key" ON "seq_no"("name");
