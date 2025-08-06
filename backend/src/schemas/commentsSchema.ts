import z from "zod";

export const commentsSchema = z.object({
  content: z.string().min(1, "Le contenu du commentaire est requis"),
  epicId: z.number().optional(),
  ticketId: z.number().optional(),
});

export const updateCommentsSchema = commentsSchema.partial();
