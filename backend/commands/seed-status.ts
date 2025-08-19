import prisma from "../src/utils/prisma";

try {
  await prisma.status.createManyAndReturn({
    data: [
      { name: "thinking" },
      { name: "ready" },
      { name: "in_progress" },
      { name: "done" },
      { name: "canceled" },
    ],
  });
} catch (error) {
  console.error("Error seeding status:", error);
}
