/*
  Warnings:

  - You are about to drop the column `image` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `imageDetail` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "image",
DROP COLUMN "imageDetail";
