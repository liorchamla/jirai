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
  createdBy: z.string().optional(),
  assignedTo: z.string().optional(),
  projectSlug: z.string({ message: "Project slug is required" }),
  status: z
    .enum(["thinking", "ready", "in_progress", "done", "canceled"])
    .optional(),
});

export const updateEpicSchema = epicsSchema.partial();
