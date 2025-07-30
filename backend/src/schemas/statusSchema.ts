import z from "zod";

export const statusSchema = z.object({
  name: z.string({ message: "Name is required" }),
});
