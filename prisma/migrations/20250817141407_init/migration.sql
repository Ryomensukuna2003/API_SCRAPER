-- CreateTable
CREATE TABLE "public"."API_KEY" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "FoundAt" TEXT NOT NULL,
    "API_NAME" TEXT NOT NULL,
    "COMMIT_URL" TEXT NOT NULL,

    CONSTRAINT "API_KEY_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "API_KEY_key_key" ON "public"."API_KEY"("key");
