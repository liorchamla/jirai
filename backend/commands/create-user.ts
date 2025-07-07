/**
 * Voir un script (qu'on puisse lancer depuis le terminal) pour créer un utilisateur (on pourra par exemple appeler ce script la première fois qu'on va déployer notre application en ligne, pour avoir au moins un premier utilisateur). Ce script devra être appelable tel que :
 *
 * pnpm create:user --username "Vincent Delaye" --position "Dev" --email "vincent@gmail.com" --password "p4ssW0rd!"
 *
 * Cette commande devra utiliser Prisma (elle sera donc codée dans le backend) pour prendre les informations passées en paramètres, créer un objet utilisateur avec, puis sauvegarder dans la base de données.
 */

import { Command } from "commander";
import prisma from "../src/utils/prisma";
import argon2 from "argon2";
import { createUserOnCommandSchema } from "../src/schemas/usersSchema";

// 1. Je veux récupérer les arguments passés en ligne de commande
const program = new Command();

program
  .name("create:user")
  .description("Créer un nouvel utilisateur")
  .option("--username <name>", "Nom de l’utilisateur")
  .option("--email <email>", "Adresse email")
  .option("--position <position>", "Poste")
  .option("--password <password>", "Mot de passe")
  .action(async (options) => {
    try {
      // 2. Je veux valider les données passées en arguments
      const result = createUserOnCommandSchema.safeParse(options);
      if (!result.success) {
        console.error(
          "❌ Oops ! Les données fournies ne sont pas valides :",
          result.error.errors
            .map((err) => `\n  • ${err.path.join(".")}: ${err.message}`)
            .join("")
        );
        console.log(
          "💡 Vérifiez que vous avez bien fourni toutes les informations requises :"
        );
        console.log("   --username, --email, --position, --password");
        process.exit(1);
      }

      // Vérification si l'email existe déjà
      const existingUser = await prisma.user.findUnique({
        where: {
          email: result.data.email,
        },
      });

      if (existingUser) {
        console.error(
          `❌ Désolé ! Un utilisateur avec l'email "${result.data.email}" existe déjà.`
        );
        console.log("💡 Veuillez utiliser une adresse email différente.");
        process.exit(1);
      }

      // vérification si le nom d'utilisateur existe déjà
      const existingUsernameUser = await prisma.user.findFirst({
        where: {
          username: result.data.username,
        },
      });
      if (existingUsernameUser) {
        console.error(
          `❌ Oops ! Le nom d'utilisateur "${result.data.username}" est déjà pris.`
        );
        console.log("💡 Choisissez un nom d'utilisateur différent.");
        process.exit(1);
      }

      const hashedPassword = await argon2.hash(result.data.password);
      result.data.password = hashedPassword;

      // 3. j'insère les données dans la base de données
      const newUser = await prisma.user.create({
        data: {
          username: result.data.username,
          email: result.data.email,
          position: result.data.position,
          password: result.data.password,
        },
      });

      console.log("📋 Récapitulatif :");
      console.log(`   👤 Nom d'utilisateur : ${newUser.username}`);
      console.log(`   📧 Email : ${newUser.email}`);
      console.log(`   💼 Poste : ${newUser.position}`);
      console.log(`   🆔 ID : ${newUser.uuid}`);
      console.log(
        "🚀 L'utilisateur peut maintenant se connecter à l'application !"
      );
    } catch (error) {
      console.error(
        "💥 Une erreur inattendue s'est produite lors de la création de l'utilisateur :"
      );
      console.error("🔍 Détails de l'erreur :", error);
      console.log("💡 Solutions possibles :");
      console.log("   • Vérifiez que la base de données est accessible");
      console.log("   • Assurez-vous que Prisma est correctement configuré");
      console.log("   • Contactez l'administrateur si le problème persiste");
      process.exit(1);
    }
  });

program.parse(process.argv);
