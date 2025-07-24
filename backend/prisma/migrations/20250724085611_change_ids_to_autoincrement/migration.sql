/*
  Warnings:

  - The primary key for the `team_members` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `joinedAt` on the `team_members` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `team_members` table. All the data in the column will be lost.
  - The `id` column on the `team_members` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `team_projects` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `assignedAt` on the `team_projects` table. All the data in the column will be lost.
  - The `id` column on the `team_projects` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updatedAt` to the `team_members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `team_projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "team_members" DROP CONSTRAINT "team_members_pkey",
DROP COLUMN "joinedAt",
DROP COLUMN "role",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "team_members_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "team_projects" DROP CONSTRAINT "team_projects_pkey",
DROP COLUMN "assignedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "team_projects_pkey" PRIMARY KEY ("id");
