-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('Pending', 'Done');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('DeliverCylinder', 'CollectEmptyCylinder');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('Pending', 'Completed');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('Low', 'Medium', 'High', 'Urgent');

-- CreateEnum
CREATE TYPE "InventoryMovementType" AS ENUM ('StockIn', 'StockOut', 'EmptyIn', 'EmptyOut', 'Adjustment');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "fullAddress" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "notes" TEXT,
    "totalCylindersReceived" INTEGER NOT NULL DEFAULT 0,
    "totalEmptyCylindersReturned" INTEGER NOT NULL DEFAULT 0,
    "totalPendingPayment" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "filledCylindersDelivered" INTEGER NOT NULL DEFAULT 0,
    "emptyCylindersReceived" INTEGER NOT NULL DEFAULT 0,
    "paymentAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'Pending',
    "deliveryDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "revenueCountedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryTask" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "taskType" "TaskType" NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'Pending',
    "priority" "TaskPriority" NOT NULL DEFAULT 'Medium',
    "reminderNotes" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RevenueRecord" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,

    CONSTRAINT "RevenueRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CylinderInventory" (
    "id" TEXT NOT NULL,
    "movementType" "InventoryMovementType" NOT NULL,
    "filledQuantity" INTEGER NOT NULL DEFAULT 0,
    "emptyQuantity" INTEGER NOT NULL DEFAULT 0,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CylinderInventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentHistory" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "transactionId" TEXT,
    "amount" DECIMAL(12,2) NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "paidAt" TIMESTAMP(3),
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailySummary" (
    "id" TEXT NOT NULL,
    "summaryDate" TIMESTAMP(3) NOT NULL,
    "revenue" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "paymentReceived" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "filledCylindersDelivered" INTEGER NOT NULL DEFAULT 0,
    "emptyCylindersCollected" INTEGER NOT NULL DEFAULT 0,
    "pendingPaymentsCount" INTEGER NOT NULL DEFAULT 0,
    "pendingTasksCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailySummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_phoneNumber_key" ON "Customer"("phoneNumber");

-- CreateIndex
CREATE INDEX "Customer_area_idx" ON "Customer"("area");

-- CreateIndex
CREATE INDEX "Customer_fullName_idx" ON "Customer"("fullName");

-- CreateIndex
CREATE INDEX "Customer_phoneNumber_idx" ON "Customer"("phoneNumber");

-- CreateIndex
CREATE INDEX "Transaction_customerId_deliveryDate_idx" ON "Transaction"("customerId", "deliveryDate");

-- CreateIndex
CREATE INDEX "Transaction_paymentStatus_deliveryDate_idx" ON "Transaction"("paymentStatus", "deliveryDate");

-- CreateIndex
CREATE INDEX "DeliveryTask_status_dueDate_idx" ON "DeliveryTask"("status", "dueDate");

-- CreateIndex
CREATE INDEX "DeliveryTask_customerId_idx" ON "DeliveryTask"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "RevenueRecord_transactionId_key" ON "RevenueRecord"("transactionId");

-- CreateIndex
CREATE INDEX "RevenueRecord_recordedAt_idx" ON "RevenueRecord"("recordedAt");

-- CreateIndex
CREATE INDEX "CylinderInventory_createdAt_idx" ON "CylinderInventory"("createdAt");

-- CreateIndex
CREATE INDEX "PaymentHistory_customerId_createdAt_idx" ON "PaymentHistory"("customerId", "createdAt");

-- CreateIndex
CREATE INDEX "PaymentHistory_status_paidAt_idx" ON "PaymentHistory"("status", "paidAt");

-- CreateIndex
CREATE UNIQUE INDEX "DailySummary_summaryDate_key" ON "DailySummary"("summaryDate");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryTask" ADD CONSTRAINT "DeliveryTask_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevenueRecord" ADD CONSTRAINT "RevenueRecord_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentHistory" ADD CONSTRAINT "PaymentHistory_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentHistory" ADD CONSTRAINT "PaymentHistory_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
