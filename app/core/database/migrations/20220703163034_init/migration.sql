/*
  Warnings:

  - A unique constraint covering the columns `[tileId]` on the table `TileTask` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `tileId` on the `TileTask` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "TileTask" DROP COLUMN "tileId",
ADD COLUMN     "tileId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TileTask_tileId_key" ON "TileTask"("tileId");

-- AddForeignKey
ALTER TABLE "TileTask" ADD CONSTRAINT "TileTask_tileId_fkey" FOREIGN KEY ("tileId") REFERENCES "Tile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
