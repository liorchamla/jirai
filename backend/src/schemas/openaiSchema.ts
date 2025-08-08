import z from "zod";

export const openaiSchema = z.object({
  projectTitle: z.string(),
  projectDescription: z.string(),
  epicTitle: z.string(),
  epicDescription: z.string(),
});
