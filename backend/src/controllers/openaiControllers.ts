import { Request, Response } from "express";
import openai from "../utils/openai";
import prisma from "../utils/prisma";
import { openaiSchema } from "../schemas/openaiSchema";

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

export async function getSummaryCommentTicket(req: Request, res: Response) {
  const { id } = req.params;

  const comments = await prisma.comment.findMany({
    where: {
      ticketId: parseInt(id),
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
          content: `Tu es un chef de projet, je vais te fournir les commentaires globaux sur un TICKET sur lequel nous travaillions. Ton but est de me fournir un résumé des commentaires concernant le TICKET.
          
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

export async function getDescriptionNewEpic(req: Request, res: Response) {
  const result = openaiSchema.safeParse(req.body);

  if (!result.success) {
    res
      .status(422)
      .json({ error: "Invalid data", issues: result.error.issues });
    return;
  }

  const { projectSlug } = req.params;

  const project = await prisma.project.findUnique({
    where: { slug: projectSlug },
  });

  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Tu es chef de projet dans la conception d'applications web, je vais te fournir les informations du projet sur laquelle nous travaillons. Je te donnerai aussi le titre d'un EPIC que l'on souhaite créer.

          Avec tout ce contexte, j'aimerai que tu génères la description de l'EPIC, correspondant au titre du ticket que je te donne.

          Voici les informations :
          Nom du projet : ${project.name}
          Description du projet : ${project.description}
          Titre de l'EPIC : ${result.data.title}

          RETOUR ATTENDU :

          A toi de me donner une description détaillée pour l'EPIC que nous sommes en train de créer.
          N'hésites pas à donner des détails, les développeurs comptent sur toi pour s'orienter !

          FORMAT :

          N'ajoute pas de préambule tel que "Description : ", "EPIC : titre de l'EPIC".

          Ne donne QUE la description, pas de contexte, pas de titre etc. Imagine que tu es devant le formulaire de création d'EPIC, et que tu ne veux remplir que le champ "Description" de ce formulaire.

          Donne moi la réponse au format HTML, n'hésites pas à utiliser des couleurs, des mots en gras et des listes à puces (ul) et à mettre en forme la description`,
        },
      ],
      max_tokens: 500,
    });

    res.status(200).json({
      description: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error generating description:", error);

    // Gestion spéciale pour les erreurs de quota OpenAI
    if (
      error &&
      typeof error === "object" &&
      "status" in error &&
      error.status === 429
    ) {
      res.status(200).json({
        description:
          "Service de génération de description IA temporairement indisponible (quota dépassé). Veuillez créer l'EPIC manuellement.",
        error: "quota_exceeded",
      });
      return;
    }

    res.status(500).json({ error: "Failed to generate description" });
  }
}

export async function getDescriptionNewTicket(req: Request, res: Response) {
  const result = openaiSchema.safeParse(req.body);

  if (!result.success) {
    res
      .status(422)
      .json({ error: "Invalid data", issues: result.error.issues });
    return;
  }

  const { epicId } = req.params;

  const epic = await prisma.epic.findUnique({
    where: { id: parseInt(epicId) },
  });

  if (!epic) {
    res.status(404).json({ error: "Epic not found" });
    return;
  }

  const project = await prisma.project.findUnique({
    where: { slug: epic.projectSlug },
  });

  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Tu es chef de projet dans la conception d'applications web, je vais te fournir les informations du projet ainsi que l'EPIC (fonctionnalité) sur laquelle nous travaillons. Je te donnerai aussi le titre d'un ticket que l'on souhaite créer.

          Avec tout ce contexte, j'aimerai que tu génères la description du ticket, correspondant au titre du ticket que je te donne.

          Voici les informations :
          Nom du projet : ${project.name}
          Description du projet : ${project.description}
          Titre de l'EPIC : ${epic.title}
          Description de l'EPIC : ${epic.description}
          Titre du ticket : ${result.data.title}

          RETOUR ATTENDU :

          A toi de me donner une description détaillée pour le ticket que nous sommes en train de créer.
          N'hésites pas à donner des détails, les développeurs comptent sur toi pour s'orienter !

          FORMAT :

          N'ajoute pas de préambule tel que "Description : ", "Ticket : titre du ticket".

          Ne donne QUE la description, pas de contexte, pas de titre etc. Imagine que tu es devant le formulaire de création de ticket, et que tu ne veux remplir que le champ "Description" de ce formulaire.

          Donne moi la réponse au format HTML, n'hésites pas à utiliser des couleurs, des mots en gras et des listes à puces (ul) et à mettre en forme la description`,
        },
      ],
      max_tokens: 500,
    });

    res.status(200).json({
      description: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error generating description:", error);

    // Gestion spéciale pour les erreurs de quota OpenAI
    if (
      error &&
      typeof error === "object" &&
      "status" in error &&
      error.status === 429
    ) {
      res.status(200).json({
        description:
          "Service de génération de description IA temporairement indisponible (quota dépassé). Veuillez créer le TICKET manuellement.",
        error: "quota_exceeded",
      });
      return;
    }

    res.status(500).json({ error: "Failed to generate description" });
  }
}
