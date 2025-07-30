import { Command } from "commander";
import { statusSchema } from "../src/schemas/statusSchema";
import prisma from "../src/utils/prisma";

const program = new Command();

program
  .name("create:status")
  .description("Créer un nouveau statut")
  .option("--name <name>", "Nom du statut")
  .action(async (options) => {
    try {
      console.log("🔄 Démarrage de la création du statut...");
      console.log("📥 Options reçues :", options);

      const result = statusSchema.safeParse(options);
      if (!result.success) {
        console.error(
          "❌ Oups ! Les données fournies ne sont pas valides :",
          result.error.errors
            .map((err) => `\n  • ${err.path.join(".")}: ${err.message}`)
            .join("")
        );
        console.log("💡 Veuillez fournir un nom valide pour le statut.");
        process.exit(1);
      }

      console.log("✅ Validation réussie. Vérification de l'unicité...");

      const existingName = await prisma.status.findFirst({
        where: {
          name: result.data.name,
        },
      });
      if (existingName) {
        console.error("❌ Oups ! Un statut avec ce nom existe déjà.");
        process.exit(1);
      }

      console.log("✅ Nom unique confirmé. Création du statut...");

      // Si la validation réussit et qu'aucun statut existant n'est trouvé, créer le nouveau statut
      const newStatus = await prisma.status.create({
        data: {
          name: result.data.name,
        },
      });
      console.log("✅ Statut créé avec succès :", newStatus);
    } catch (error) {
      console.error(
        "❌ Une erreur est survenue lors de la création du statut :",
        error
      );
      await prisma.$disconnect();
      process.exit(1);
    }
  });

program.parse(process.argv);
