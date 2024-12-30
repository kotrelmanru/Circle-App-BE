/*
  Warnings:

  - You are about to drop the column `isFollow` on the `Follow` table. All the data in the column will be lost.
  - You are about to drop the column `isLike` on the `Like` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Follow" DROP COLUMN "isFollow";

-- AlterTable
ALTER TABLE "Like" DROP COLUMN "isLike";
