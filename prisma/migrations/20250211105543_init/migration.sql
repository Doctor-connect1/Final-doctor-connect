-- CreateTable
CREATE TABLE `users` (
    `UserID` INTEGER NOT NULL AUTO_INCREMENT,
    `FirstName` VARCHAR(191) NULL,
    `LastName` VARCHAR(191) NULL,
    `Username` VARCHAR(191) NOT NULL,
    `Password` VARCHAR(191) NOT NULL,
    `Email` VARCHAR(191) NOT NULL,
    `Role` ENUM('Doctor', 'Patient', 'Admin') NOT NULL,
    `LocationLatitude` DECIMAL(65, 30) NULL,
    `LocationLongitude` DECIMAL(65, 30) NULL,
    `Bio` VARCHAR(191) NULL,
    `MeetingPrice` DECIMAL(65, 30) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_Username_key`(`Username`),
    UNIQUE INDEX `users_Email_key`(`Email`),
    PRIMARY KEY (`UserID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `appointments` (
    `AppointmentID` INTEGER NOT NULL AUTO_INCREMENT,
    `PatientID` INTEGER NOT NULL,
    `DoctorID` INTEGER NOT NULL,
    `AppointmentDate` DATETIME(3) NOT NULL,
    `DurationMinutes` INTEGER NOT NULL,
    `Status` ENUM('pending', 'confirmed', 'rejected') NOT NULL DEFAULT 'pending',
    `Type` ENUM('Sur terrain', 'DISTANCE') NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`AppointmentID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `availability` (
    `AvailabilityID` INTEGER NOT NULL AUTO_INCREMENT,
    `DoctorID` INTEGER NOT NULL,
    `AvailableDate` DATETIME(3) NOT NULL,
    `StartTime` VARCHAR(191) NOT NULL,
    `EndTime` VARCHAR(191) NOT NULL,
    `IsAvailable` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`AvailabilityID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Chatrooms` (
    `ChatroomID` INTEGER NOT NULL AUTO_INCREMENT,
    `PatientID` INTEGER NOT NULL,
    `DoctorID` INTEGER NOT NULL,
    `StartTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`ChatroomID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChatroomMessages` (
    `MessageID` INTEGER NOT NULL AUTO_INCREMENT,
    `ChatroomID` INTEGER NOT NULL,
    `SenderID` INTEGER NOT NULL,
    `MessageText` VARCHAR(191) NOT NULL,
    `SentAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`MessageID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Doctors` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `Password` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `specialty` VARCHAR(191) NOT NULL,
    `experience` INTEGER NOT NULL,
    `bio` VARCHAR(191) NULL,
    `profilePicture` VARCHAR(191) NULL,
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `LocationLatitude` DECIMAL(65, 30) NULL,
    `LocationLongitude` DECIMAL(65, 30) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Doctors_userId_key`(`userId`),
    UNIQUE INDEX `Doctors_email_key`(`email`),
    UNIQUE INDEX `Doctors_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Patients` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `dateOfBirth` DATETIME(3) NOT NULL,
    `gender` ENUM('Male', 'Female') NOT NULL,
    `profilePicture` VARCHAR(191) NULL,
    `medicalHistory` VARCHAR(191) NULL,
    `LocationLatitude` DECIMAL(65, 30) NULL,
    `LocationLongitude` DECIMAL(65, 30) NULL,
    `Password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Patients_userId_key`(`userId`),
    UNIQUE INDEX `Patients_email_key`(`email`),
    UNIQUE INDEX `Patients_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DoctorReview` (
    `ReviewID` INTEGER NOT NULL AUTO_INCREMENT,
    `DoctorID` INTEGER NOT NULL,
    `PatientID` INTEGER NOT NULL,
    `Rating` INTEGER NOT NULL,
    `comment` VARCHAR(191) NULL,
    `ReviewText` VARCHAR(191) NULL,
    `ReviewDate` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`ReviewID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Media` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NULL,
    `doctorId` INTEGER NULL,
    `patientId` INTEGER NULL,
    `url` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Media_UserID_key`(`UserID`),
    UNIQUE INDEX `Media_doctorId_key`(`doctorId`),
    UNIQUE INDEX `Media_patientId_key`(`patientId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Specialty` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `userId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Specialty_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_PatientID_fkey` FOREIGN KEY (`PatientID`) REFERENCES `users`(`UserID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_DoctorID_fkey` FOREIGN KEY (`DoctorID`) REFERENCES `users`(`UserID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `availability` ADD CONSTRAINT `availability_DoctorID_fkey` FOREIGN KEY (`DoctorID`) REFERENCES `Doctors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chatrooms` ADD CONSTRAINT `Chatrooms_PatientID_fkey` FOREIGN KEY (`PatientID`) REFERENCES `Patients`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chatrooms` ADD CONSTRAINT `Chatrooms_DoctorID_fkey` FOREIGN KEY (`DoctorID`) REFERENCES `Doctors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatroomMessages` ADD CONSTRAINT `ChatroomMessages_ChatroomID_fkey` FOREIGN KEY (`ChatroomID`) REFERENCES `Chatrooms`(`ChatroomID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatroomMessages` ADD CONSTRAINT `ChatroomMessages_SenderID_fkey` FOREIGN KEY (`SenderID`) REFERENCES `users`(`UserID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Doctors` ADD CONSTRAINT `Doctors_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`UserID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Patients` ADD CONSTRAINT `Patients_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`UserID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DoctorReview` ADD CONSTRAINT `DoctorReview_DoctorID_fkey` FOREIGN KEY (`DoctorID`) REFERENCES `Doctors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DoctorReview` ADD CONSTRAINT `DoctorReview_PatientID_fkey` FOREIGN KEY (`PatientID`) REFERENCES `Patients`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Media` ADD CONSTRAINT `Media_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `users`(`UserID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Media` ADD CONSTRAINT `Media_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctors`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Media` ADD CONSTRAINT `Media_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patients`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Specialty` ADD CONSTRAINT `Specialty_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`UserID`) ON DELETE SET NULL ON UPDATE CASCADE;
