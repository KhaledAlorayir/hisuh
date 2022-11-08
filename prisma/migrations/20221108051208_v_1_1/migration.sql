/*
  Warnings:

  - A unique constraint covering the columns `[list_id,user_id]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Like_list_id_user_id_key" ON "Like"("list_id", "user_id");
