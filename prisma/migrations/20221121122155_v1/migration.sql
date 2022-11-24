/*
  Warnings:

  - A unique constraint covering the columns `[lat,lon,place_id]` on the table `Spot` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Spot_lat_lon_key";

-- AlterTable
ALTER TABLE "Spot" ADD COLUMN     "place_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Spot_lat_lon_place_id_key" ON "Spot"("lat", "lon", "place_id");
