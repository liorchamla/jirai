import prisma from "./prisma";

/**
 * Validates the ID.
 * @param id - The ID to validate.
 * @returns True if the ID is valid, false otherwise.
 */
export function isValidId(id: number): boolean {
  return !isNaN(id) && id > 0 && Number.isInteger(id);
}

export async function findStatusByName(statusName: string): Promise<{
  id: number;
  name: string;
} | null> {
  const status = await prisma.status.findFirst({
    where: { name: statusName },
  });
  return status;
}
