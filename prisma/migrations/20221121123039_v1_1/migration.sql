/*
  Warnings:

  - A unique constraint covering the columns `[lat,lon]` on the table `Spot` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Spot_lat_lon_place_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Spot_lat_lon_key" ON "Spot"("lat", "lon");
