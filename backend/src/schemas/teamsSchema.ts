import z from "zod";

export const createTeamSchema = z.object({
  name: z
    .string({ message: "Team name is required" })
    .min(2, { message: "Team name must be at least 2 characters long" }),
});

export const updateTeamSchema = createTeamSchema.partial();
