-- AlterTable
ALTER TABLE `doctors` MODIFY `bio` TEXT NULL;

-- AlterTable
ALTER TABLE `patients` ADD COLUMN `bio` TEXT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `Bio` TEXT NULL;
