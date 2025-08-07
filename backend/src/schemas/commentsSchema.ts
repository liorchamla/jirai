import z from "zod";

export const commentsSchema = z.object({
  content: z.string().min(2, "Le contenu doit contenir au moins 2 caractères."),
  epicId: z.number().optional(),
  ticketId: z.number().optional(),
});

export const updateCommentsSchema = commentsSchema.partial();
