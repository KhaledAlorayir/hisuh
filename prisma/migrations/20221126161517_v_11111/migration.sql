-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_list_id_fkey";

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;
