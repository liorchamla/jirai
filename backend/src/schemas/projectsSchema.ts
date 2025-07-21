import z from "zod";

export const createProjectSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(2, { message: "Name must be at least 2 characters long" }),
  description: z
    .string({ required_error: "Description is required" })
    .min(5, { message: "Description must be at least 5 characters long" }),
});

export const updateProjectSchema = createProjectSchema.partial();
