-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('UNDEFINED', 'MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER', 'AUDITOR');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "uuid" VARCHAR(1000) NOT NULL,
    "gender" "Gender" NOT NULL DEFAULT 'UNDEFINED',
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(500) NOT NULL,
    "birthDate" DATE NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phoneNumber" VARCHAR(100) NOT NULL,
    "address" VARCHAR(1500) NOT NULL,
    "profilePicUrl" VARCHAR(2500) NOT NULL,
    "passwordHash" VARCHAR(100) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "roles" "Role"[] DEFAULT ARRAY['USER']::"Role"[],
    "createdAt" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "createdBy" VARCHAR(255),
    "updatedAt" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" VARCHAR(255),
    "deletedAt" TIMESTAMPTZ(3),
    "deletedBy" VARCHAR(255),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "uuid" VARCHAR(1000) NOT NULL,
    "userUuid" VARCHAR(1000) NOT NULL,
    "userData" JSONB NOT NULL,
    "refreshTokenHash" VARCHAR(5000) NOT NULL,
    "revokedAt" TIMESTAMPTZ(3),
    "revokedBy" VARCHAR(255),
    "revocationReason" VARCHAR(1000),
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "createdBy" VARCHAR(255),
    "updatedAt" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" VARCHAR(255),
    "deletedAt" TIMESTAMPTZ(3),
    "deletedBy" VARCHAR(255),

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_uuid_key" ON "User"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_uuid_key" ON "Session"("uuid");
