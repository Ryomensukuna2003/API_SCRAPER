/*
  Warnings:

  - You are about to drop the column `API_NAME` on the `API_KEY` table. All the data in the column will be lost.
  - You are about to drop the column `COMMIT_URL` on the `API_KEY` table. All the data in the column will be lost.
  - Added the required column `api_name` to the `API_KEY` table without a default value. This is not possible if the table is not empty.
  - Added the required column `commit_url` to the `API_KEY` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."API_KEY" DROP COLUMN "API_NAME",
DROP COLUMN "COMMIT_URL",
ADD COLUMN     "api_name" TEXT NOT NULL,
ADD COLUMN     "commit_url" TEXT NOT NULL;
