import z from "zod";

export const createProjectSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(2, { message: "Name must be at least 2 characters long" }),
  description: z
    .string({ message: "Description is required" })
    .min(5, { message: "Description must be at least 5 characters long" }),
  status: z
    .string({ message: "Status is required" })
    .min(2, { message: "Status must be at least 2 characters long" }),
});

export const updateProjectSchema = createProjectSchema.partial();
