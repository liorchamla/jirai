import { Request, Response } from "express";
import openai from "../utils/openai";
import prisma from "../utils/prisma";

export async function getSummaryCommentEpic(req: Request, res: Response) {
  const { id } = req.params;

  const comments = await prisma.comment.findMany({
    where: {
      epicId: parseInt(id),
    },
    include: {
      creator: true,
    },
    orderBy: [{ createdAt: "asc" }],
  });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Tu es un chef de projet, je vais te fournir les commentaires globaux sur une EPIC sur lequel nous travaillions. Ton but est de me fournir un résumé des commentaires concernant l'EPIC.
          
          Ne répond que par le résumé des commentaires, sans autres explications.
          N'hésite pas à nommer les auteurs des commentaires.
          Voici les commentaires :
          ${comments
            .map(
              (comment) =>
                `${comment.creator.username} dit : ${comment.content}`
            )
            .join("\n")}`,
        },
      ],
      max_tokens: 500,
    });

    res.status(200).json({
      summary: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error generating summary:", error);

    // Gestion spéciale pour les erreurs de quota OpenAI
    if (
      error &&
      typeof error === "object" &&
      "status" in error &&
      error.status === 429
    ) {
      res.status(200).json({
        summary:
          "Service de résumé IA temporairement indisponible (quota dépassé). Veuillez consulter directement les commentaires ci-dessous.",
        error: "quota_exceeded",
      });
      return;
    }

    res.status(500).json({ error: "Failed to generate summary" });
  }
}
