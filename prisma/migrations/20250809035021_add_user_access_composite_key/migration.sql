-- CreateTable
CREATE TABLE "userAccess" (
    "user_id" TEXT NOT NULL,
    "access" TEXT NOT NULL,

    CONSTRAINT "userAccess_pkey" PRIMARY KEY ("user_id","access")
);

-- AddForeignKey
ALTER TABLE "userAccess" ADD CONSTRAINT "userAccess_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
