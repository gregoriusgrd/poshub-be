/*
  Warnings:

  - Added the required column `adminId` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adminId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Shift" DROP CONSTRAINT "Shift_cashierId_fkey";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "adminId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "adminId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Cashier" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "adminId" INTEGER NOT NULL,

    CONSTRAINT "Cashier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cashier_email_key" ON "Cashier"("email");

-- CreateIndex
CREATE INDEX "Cashier_adminId_isDeleted_idx" ON "Cashier"("adminId", "isDeleted");

-- CreateIndex
CREATE INDEX "Cashier_fullName_isDeleted_idx" ON "Cashier"("fullName", "isDeleted");

-- CreateIndex
CREATE INDEX "Cashier_email_isDeleted_idx" ON "Cashier"("email", "isDeleted");

-- CreateIndex
CREATE INDEX "Transaction_cashierId_transactionTime_idx" ON "Transaction"("cashierId", "transactionTime");

-- AddForeignKey
ALTER TABLE "Cashier" ADD CONSTRAINT "Cashier_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_cashierId_fkey" FOREIGN KEY ("cashierId") REFERENCES "Cashier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
