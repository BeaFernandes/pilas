/*
  Warnings:

  - You are about to drop the `ProductsOrders` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `amount` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productPrice` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductsOrders" DROP CONSTRAINT "ProductsOrders_orderId_fkey";

-- DropForeignKey
ALTER TABLE "ProductsOrders" DROP CONSTRAINT "ProductsOrders_productId_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "productId" INTEGER NOT NULL,
ADD COLUMN     "productPrice" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "ProductsOrders";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
