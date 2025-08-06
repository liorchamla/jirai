import prisma from "../../utils/prisma";

/**
 * Clean all tables in the correct order to respect foreign key constraints
 * Should be called in beforeEach and afterAll hooks
 */
export async function cleanDatabase(): Promise<void> {
  // Delete in reverse dependency order
  await prisma.comment.deleteMany({});
  await prisma.ticket.deleteMany({});
  await prisma.epic.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.team.deleteMany({});
  await prisma.status.deleteMany({});
  await prisma.user.deleteMany({});
}

/**
 * Clean database and disconnect Prisma client
 * Should be called in global afterAll hook
 */
export async function cleanupTestDatabase(): Promise<void> {
  await cleanDatabase();
  await prisma.$disconnect();
}
