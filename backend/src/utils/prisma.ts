import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  omit: {
    user: {
      password: true, // Omit the password field from user queries
    },
  },
});

export default prisma;
