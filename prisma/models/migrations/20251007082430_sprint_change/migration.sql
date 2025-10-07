/*
  Warnings:

  - You are about to drop the column `adminId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `adminId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Cashier` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductImage` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Cashier" DROP CONSTRAINT "Cashier_adminId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Category" DROP CONSTRAINT "Category_adminId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_adminId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductImage" DROP CONSTRAINT "ProductImage_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Shift" DROP CONSTRAINT "Shift_cashierId_fkey";

-- DropIndex
DROP INDEX "public"."User_email_isDeleted_idx";

-- DropIndex
DROP INDEX "public"."User_email_key";

-- DropIndex
DROP INDEX "public"."User_fullName_isDeleted_idx";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "adminId";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "adminId",
ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
ADD COLUMN     "username" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."Cashier";

-- DropTable
DROP TABLE "public"."ProductImage";

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_username_isDeleted_idx" ON "User"("username", "isDeleted");

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_cashierId_fkey" FOREIGN KEY ("cashierId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
