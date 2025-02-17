-- AlterTable
ALTER TABLE `patients` MODIFY `gender` ENUM('Male', 'Female') NULL,
    MODIFY `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updatedAt` DATETIME(3) NULL;
