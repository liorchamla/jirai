import z from "zod";

export const openaiSchema = z.object({
  title: z
    .string({ message: "Title is required" })
    .min(2, { message: "Title must be at least 2 characters long" }),
});
