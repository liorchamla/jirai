/*
  Warnings:

  - You are about to drop the `team_members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `team_projects` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "team_members" DROP CONSTRAINT "team_members_teamId_fkey";

-- DropForeignKey
ALTER TABLE "team_members" DROP CONSTRAINT "team_members_userId_fkey";

-- DropForeignKey
ALTER TABLE "team_projects" DROP CONSTRAINT "team_projects_projectId_fkey";

-- DropForeignKey
ALTER TABLE "team_projects" DROP CONSTRAINT "team_projects_teamId_fkey";

-- DropTable
DROP TABLE "team_members";

-- DropTable
DROP TABLE "team_projects";

-- CreateTable
CREATE TABLE "_ProjectToTeam" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjectToTeam_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_TeamToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TeamToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProjectToTeam_B_index" ON "_ProjectToTeam"("B");

-- CreateIndex
CREATE INDEX "_TeamToUser_B_index" ON "_TeamToUser"("B");

-- AddForeignKey
ALTER TABLE "_ProjectToTeam" ADD CONSTRAINT "_ProjectToTeam_A_fkey" FOREIGN KEY ("A") REFERENCES "projects"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToTeam" ADD CONSTRAINT "_ProjectToTeam_B_fkey" FOREIGN KEY ("B") REFERENCES "teams"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamToUser" ADD CONSTRAINT "_TeamToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "teams"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamToUser" ADD CONSTRAINT "_TeamToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
