import z from "zod";

export const epicsSchema = z.object({
  title: z
    .string({ message: "Title is required" })
    .min(2, { message: "Title must be at least 2 characters long" }),
  description: z
    .string({ message: "Description is required" })
    .min(2, { message: "Description must be at least 2 characters long" }),
  priority: z.enum(["high", "medium", "low", "frozen"], {
    message: "Priority must be one of: high, medium, low, frozen",
  }),
  projectSlug: z.string({ message: "Project slug is required" }),
});

export const updateEpicSchema = epicsSchema.partial();
