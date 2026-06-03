-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('ADMIN', 'USER', 'EMPLOYEE');

-- CreateTable
CREATE TABLE "User" (
    "id_user" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Roles" NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id_user")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
