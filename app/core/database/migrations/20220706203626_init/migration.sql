/*
  Warnings:

  - You are about to drop the column `joinedAd` on the `Player` table. All the data in the column will be lost.
  - Added the required column `joinedAt` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "joinedAd",
ADD COLUMN     "joinedAt" TIMESTAMP(3) NOT NULL;
