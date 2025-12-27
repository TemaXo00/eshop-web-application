/*
  Warnings:

  - You are about to drop the `stock` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "stock" DROP CONSTRAINT "stock_product_id_fkey";

-- DropForeignKey
ALTER TABLE "stock" DROP CONSTRAINT "stock_store_id_fkey";

-- DropTable
DROP TABLE "stock";
