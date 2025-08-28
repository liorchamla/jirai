import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ProjectsList from "./ProjectsList";
import * as projectApi from "../../api/projects";
import type { Project } from "../../types/Project";

const MOCK_PROJECTS = {
  projects: [
    {
      slug: "l-etrange-noel-de-jack",
      name: "L'étrange Noël de Jack",
      description:
        "<p>Un projet de film d'animation de fou pour tout public avec ses actions, farces, son histoire incroyable et son univers déroutant</p>",
      status: "active",
      createdAt: "2025-08-06T16:07:12.842Z",
      updatedAt: "2025-08-25T12:31:11.055Z",
      creator: {
        uuid: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
        username: "Vincent DELAYE",
        email: "vince@mail.com",
        position: "Dev",
        createdAt: "2025-08-06T16:07:12.773Z",
        updatedAt: "2025-08-25T09:25:47.219Z",
      },
      teams: [
        {
          slug: "dev-mobile",
          name: "Dev mobile",
          createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
          createdAt: "2025-08-06T16:07:12.780Z",
          updatedAt: "2025-08-06T16:07:12.780Z",
        },
        {
          slug: "qa",
          name: "QA",
          createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
          createdAt: "2025-08-06T16:07:12.780Z",
          updatedAt: "2025-08-06T16:07:12.780Z",
        },
      ],
      epics: [
        {
          id: 107,
          title: "Tests",
          description:
            '<p>EPIC pour la création des tests pour le projet "L\'étrange Noël de Jack" :</p><ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Mise en place de tests unitaires pour chaque composant de l\'application web</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Création de tests d\'intégration pour vérifier le bon fonctionnement des différentes parties de l\'application</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Tests de régression pour assurer que les nouvelles fonctionnalités ne cassent pas les fonctionnalités existantes</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Tests de performance pour s\'assurer de la rapidité et de la stabilité de l\'application</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Tests de compatibilité pour vérifier que l\'application fonctionne correctement sur différents navigateurs et appareils</li></ol>',
          priority: "high",
          createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
          assignedTo: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
          projectSlug: "l-etrange-noel-de-jack",
          statusId: 55,
          createdAt: "2025-08-18T08:13:44.496Z",
          updatedAt: "2025-08-22T13:46:23.958Z",
          status: {
            id: 55,
            name: "thinking",
            createdAt: "2025-08-06T16:07:12.845Z",
            updatedAt: "2025-08-06T16:07:12.845Z",
          },
          comments: [
            {
              id: 57,
              content: "<p>Salut à tous</p>",
              createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
              createdAt: "2025-08-20T20:04:20.259Z",
              updatedAt: "2025-08-20T20:04:20.259Z",
              epicId: 107,
              ticketId: null,
            },
          ],
          tickets: [],
        },
        {
          id: 105,
          title: "CRUD utilisateur",
          description:
            "<p><span style=\"color: rgb(51, 51, 51);\">Le CRUD utilisateur est un ensemble de fonctionnalités visant à permettre aux utilisateurs de s'inscrire, se connecter, modifier et supprimer leur compte sur notre plateforme. Cela inclut la création d'un formulaire d'inscription avec vérification des données, la mise en place d'un système d'authentification sécurisé, la possibilité pour les utilisateurs de modifier leur profil et de supprimer leur compte si besoin. Il est essentiel de garantir la confidentialité et la sécurité des données utilisateurs tout au long de ce processus.</span></p>",
          priority: "frozen",
          createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
          assignedTo: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
          projectSlug: "l-etrange-noel-de-jack",
          statusId: 56,
          createdAt: "2025-08-07T08:08:15.472Z",
          updatedAt: "2025-08-22T12:31:06.364Z",
          status: {
            id: 56,
            name: "ready",
            createdAt: "2025-08-06T16:07:12.845Z",
            updatedAt: "2025-08-06T16:07:12.845Z",
          },
          comments: [],
          tickets: [
            {
              id: 57,
              title: "Effectuer les tests unitaire",
              description:
                "<p>Le ticket \"Effectuer les tests unitaires\" consiste à mettre en place des tests automatisés pour vérifier le bon fonctionnement de toutes les fonctionnalités liées au CRUD utilisateur. Cela inclut la création de différents scénarios de test pour l'inscription, la connexion, la modification et la suppression de comptes. Les tests doivent couvrir tous les cas d'utilisation possibles, notamment les cas d'erreurs et les conditions limites. Il est essentiel de s'assurer que les tests sont exhaustifs, robustes et régulièrement mis à jour pour garantir la fiabilité et la qualité du système.</p>",
              priority: "low",
              createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
              assignedTo: "d9d0fe32-9069-406c-a0eb-1e4bf34231ec",
              epicId: 105,
              statusId: 56,
              createdAt: "2025-08-18T13:32:34.257Z",
              updatedAt: "2025-08-24T15:56:57.654Z",
              status: {
                id: 56,
                name: "ready",
                createdAt: "2025-08-06T16:07:12.845Z",
                updatedAt: "2025-08-06T16:07:12.845Z",
              },
              comments: [],
            },
          ],
        },
        {
          id: 106,
          title: "Effectuer tests unitaires",
          description:
            '<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Le projet "L\'étrange Noël de Jack" nécessite la mise en place de tests unitaires pour garantir la fiabilité et la robustesse de l\'application web.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Les tests unitaires seront essentiels pour vérifier le bon fonctionnement des différentes fonctionnalités de l\'application et s\'assurer de la qualité du code.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Il faudra mettre en place des cas de tests variés, couvrant tous les scénarios d\'utilisation possibles, afin de détecter rapidement d\'éventuels bugs ou erreurs.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Les tests unitaires permettront également de faciliter la maintenance future de l\'application en identifiant plus facilement les problèmes lors de modifications ou ajouts de fonctionnalités.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Un effort particulier sera porté sur l\'automatisation des tests unitaires, afin d\'optimiser le processus de développement et de minimiser les risques d\'erreurs.</li></ol>',
          priority: "frozen",
          createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
          assignedTo: "d412557d-6edb-4b3f-bdfd-8f784cf0aaec",
          projectSlug: "l-etrange-noel-de-jack",
          statusId: 57,
          createdAt: "2025-08-18T08:10:09.689Z",
          updatedAt: "2025-08-24T21:32:28.919Z",
          status: {
            id: 57,
            name: "in_progress",
            createdAt: "2025-08-06T16:07:12.845Z",
            updatedAt: "2025-08-06T16:07:12.845Z",
          },
          comments: [
            {
              id: 60,
              content: "<p>Ca va être compliqué</p>",
              createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
              createdAt: "2025-08-24T15:52:43.955Z",
              updatedAt: "2025-08-24T15:52:43.955Z",
              epicId: 106,
              ticketId: null,
            },
          ],
          tickets: [],
        },
        {
          id: 102,
          title: "Optimisation des performances",
          description:
            '<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Optimiser les requêtes SQL pour réduire le temps de chargement des données</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Minimiser les fichiers CSS et JS pour améliorer la vitesse de chargement des pages</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Mettre en place des techniques de caching pour diminuer la charge sur le serveur</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Optimiser les images pour réduire leur taille et améliorer le temps de chargement</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Évaluer et améliorer la performance globale de l\'application web en identifiant les goulets d\'étranglement</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Effectuer des tests de charge pour s\'assurer que l\'application peut gérer un grand nombre d\'utilisateurs simultanément</li></ol>',
          priority: "medium",
          createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
          assignedTo: "4b6268b1-5220-4607-9880-2835d184a92b",
          projectSlug: "l-etrange-noel-de-jack",
          statusId: 57,
          createdAt: "2025-08-06T16:07:12.848Z",
          updatedAt: "2025-08-27T13:14:13.379Z",
          status: {
            id: 57,
            name: "in_progress",
            createdAt: "2025-08-06T16:07:12.845Z",
            updatedAt: "2025-08-06T16:07:12.845Z",
          },
          comments: [
            {
              id: 12,
              content:
                "Parfait ! Cette solution répond exactement à notre besoin.",
              createdBy: "fafc2307-e424-4652-a212-7120dd7d967c",
              createdAt: "2025-08-06T16:07:12.855Z",
              updatedAt: "2025-08-06T16:07:12.858Z",
              epicId: 102,
              ticketId: null,
            },
            {
              id: 13,
              content:
                "Il faudrait peut-être ajouter des logs pour faciliter le debugging.",
              createdBy: "65e70f31-faca-4f55-b1eb-17fc775f61d6",
              createdAt: "2025-08-06T16:07:12.853Z",
              updatedAt: "2025-08-06T16:07:12.859Z",
              epicId: 102,
              ticketId: null,
            },
          ],
          tickets: [
            {
              id: 55,
              title: "Effectuer les tests",
              description:
                '<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Effectuer les tests de performance pour vérifier l\'impact de la mise en place du pipeline de déploiement automatisé sur les performances du système.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Identifier les éventuels goulots d\'étranglement et les points d\'amélioration en termes de performances.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Récolter et analyser les données afin de s\'assurer que le système répond aux critères de performance définis dans l\'EPIC "Optimisation des performances".</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Documenter les résultats des tests et les actions correctives à entreprendre, le cas échéant.</li></ol>',
              priority: "frozen",
              createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
              assignedTo: null,
              epicId: 102,
              statusId: 55,
              createdAt: "2025-08-18T07:31:14.037Z",
              updatedAt: "2025-08-18T07:31:14.037Z",
              status: {
                id: 55,
                name: "thinking",
                createdAt: "2025-08-06T16:07:12.845Z",
                updatedAt: "2025-08-06T16:07:12.845Z",
              },
              comments: [],
            },
            {
              id: 56,
              title: "Tests",
              description:
                '<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Objectif :</strong> Tester la capacité de l\'application à gérer un grand nombre d\'utilisateurs simultanément</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Tâches à réaliser :</strong></li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Créer des scénarios de tests de charge pour simuler un grand nombre d\'utilisateurs se connectant en même temps</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Exécuter les tests de charge pour évaluer les performances de l\'application dans des conditions de surcharge</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Analyser les résultats des tests de charge et identifier les éventuels problèmes de performance</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Proposer des recommandations pour optimiser l\'application et la rendre plus robuste face à un trafic intense</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Résultats attendus :</strong> Un rapport détaillé des tests de charge réalisés, incluant les performances de l\'application, les éventuels goulets d\'étranglement identifiés et les recommandations d\'optimisation</li></ol>',
              priority: "frozen",
              createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
              assignedTo: null,
              epicId: 102,
              statusId: 55,
              createdAt: "2025-08-18T12:19:37.217Z",
              updatedAt: "2025-08-18T12:19:37.217Z",
              status: {
                id: 55,
                name: "thinking",
                createdAt: "2025-08-06T16:07:12.845Z",
                updatedAt: "2025-08-06T16:07:12.845Z",
              },
              comments: [],
            },
          ],
        },
        {
          id: 104,
          title: "Monitoring et logs",
          description:
            '<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="color: blue;">Objectif :</span> Mettre en place un système de monitoring et de logs pour l\'application web afin de permettre une surveillance en temps réel et une traçabilité des actions effectuées par les utilisateurs.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="color: blue;">Fonctionnalités :</span></li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Mise en place d\'outils de suivi des performances de l\'application tel que New Relic ou Datadog.</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Enregistrement des logs des actions effectuées par les utilisateurs pour faciliter le débogage des erreurs et l\'analyse de comportement.</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Création de tableaux de bord personnalisés pour afficher les données de monitoring de manière claire et intuitive.</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Notification en cas de dysfonctionnement ou de dépassement des seuils prédéfinis pour garantir la disponibilité et la performance de l\'application.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="color: blue;">Bénéfices :</span></li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Amélioration de la réactivité face aux problèmes techniques grâce à la détection rapide des anomalies.</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Optimisation des performances de l\'application en identifiant les goulets d\'étranglement et en apportant des correctifs.</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Renforcement de la sécurité des données par la surveillance des activités suspectes ou non autorisées.</li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Amélioration de la qualité des services offerts aux utilisateurs grâce à une meilleure connaissance des comportements et des besoins.</li></ol>',
          priority: "low",
          createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
          assignedTo: "8709459e-dcb3-426c-9fcc-54db7b53a7c6",
          projectSlug: "l-etrange-noel-de-jack",
          statusId: 57,
          createdAt: "2025-08-06T16:07:12.849Z",
          updatedAt: "2025-08-24T15:13:12.508Z",
          status: {
            id: 57,
            name: "in_progress",
            createdAt: "2025-08-06T16:07:12.845Z",
            updatedAt: "2025-08-06T16:07:12.845Z",
          },
          comments: [
            {
              id: 15,
              content:
                "La documentation est très bien rédigée, merci pour le détail.",
              createdBy: "ed0f5cf4-e635-4d97-aea1-0a3d324a007e",
              createdAt: "2025-08-06T16:07:12.856Z",
              updatedAt: "2025-08-06T16:07:12.859Z",
              epicId: 104,
              ticketId: null,
            },
            {
              id: 16,
              content:
                "Je pense qu'on devrait ajouter des tests supplémentaires pour cette partie.",
              createdBy: "85b0bcf8-9642-4ce0-97b5-6a8b2ae6fab2",
              createdAt: "2025-08-06T16:07:12.850Z",
              updatedAt: "2025-08-06T16:07:12.860Z",
              epicId: 104,
              ticketId: null,
            },
            {
              id: 17,
              content:
                "Attention aux performances sur cette fonctionnalité, il faut optimiser.",
              createdBy: "173a9b09-a460-40ca-ad4f-4cf1c75547fc",
              createdAt: "2025-08-06T16:07:12.853Z",
              updatedAt: "2025-08-06T16:07:12.860Z",
              epicId: 104,
              ticketId: null,
            },
          ],
          tickets: [
            {
              id: 51,
              title: "Créer l'interface utilisateur",
              description:
                '<p><strong>Description :</strong></p><ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Mise en place d\'une interface utilisateur ergonomique et intuitive pour le système de monitoring</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Inclure des fonctionnalités de personnalisation permettant à chaque utilisateur de configurer son affichage selon ses besoins</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Intégrer des graphiques interactifs pour une visualisation claire des données de performance en temps réel</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Assurer une compatibilité avec différents types de dispositifs et navigateurs pour une expérience utilisateur optimale</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Collaborer avec l\'équipe UX/UI pour garantir une interface esthétique et facile à utiliser</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Tester l\'interface avec des utilisateurs finaux pour s\'assurer de sa facilité d\'utilisation et de sa pertinence</li></ol>',
              priority: "medium",
              createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
              assignedTo: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
              epicId: 104,
              statusId: 58,
              createdAt: "2025-08-06T16:07:12.853Z",
              updatedAt: "2025-08-24T15:07:21.258Z",
              status: {
                id: 58,
                name: "done",
                createdAt: "2025-08-06T16:07:12.845Z",
                updatedAt: "2025-08-06T16:07:12.845Z",
              },
              comments: [
                {
                  id: 31,
                  content:
                    "Je propose de refactoriser cette partie pour éviter la récurrence.",
                  createdBy: "feac2eab-f980-4793-978e-d282a7b92980",
                  createdAt: "2025-08-06T16:07:12.856Z",
                  updatedAt: "2025-08-06T16:07:12.866Z",
                  epicId: null,
                  ticketId: 51,
                },
                {
                  id: 32,
                  content:
                    "Il faudrait documenter cette solution pour l'équipe.",
                  createdBy: "873d1604-ecf0-4802-ad5c-5bd98fbf8aa7",
                  createdAt: "2025-08-06T16:07:12.862Z",
                  updatedAt: "2025-08-06T16:07:12.867Z",
                  epicId: null,
                  ticketId: 51,
                },
                {
                  id: 42,
                  content: "<p><strong><em>Super boulot</em></strong></p>",
                  createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
                  createdAt: "2025-08-08T06:49:21.305Z",
                  updatedAt: "2025-08-08T06:49:21.305Z",
                  epicId: null,
                  ticketId: 51,
                },
                {
                  id: 53,
                  content: "<p>Salut salut</p>",
                  createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
                  createdAt: "2025-08-08T13:13:17.990Z",
                  updatedAt: "2025-08-08T13:13:17.990Z",
                  epicId: null,
                  ticketId: 51,
                },
              ],
            },
            {
              id: 50,
              title: "Créer les tests unitaires",
              description:
                '<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Créer les tests unitaires pour garantir le bon fonctionnement des fonctionnalités de monitoring et de logs mises en place dans le cadre de l\'EPIC "Monitoring et logs".</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Élaborer des scénarios de tests couvrant l\'ensemble des cas d\'utilisation et des interactions possibles avec les outils de suivi des performances, l\'enregistrement des logs, les tableaux de bord personnalisés et les notifications en cas de dysfonctionnement.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Implémenter les tests unitaires en utilisant des frameworks adaptés tels que Jest, Mocha ou PHPUnit pour évaluer la conformité du code et détecter d\'éventuelles erreurs ou régressions.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Vérifier la qualité du code en s\'assurant de la couverture optimale des différentes parties de l\'application web concernées par le système de monitoring et de logs.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Assurer la maintenabilité et la scalabilité des tests unitaires en les intégrant aux processus de développement et de déploiement continu.</li></ol>',
              priority: "frozen",
              createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
              assignedTo: "873d1604-ecf0-4802-ad5c-5bd98fbf8aa7",
              epicId: 104,
              statusId: 55,
              createdAt: "2025-08-06T16:07:12.852Z",
              updatedAt: "2025-08-24T15:14:08.323Z",
              status: {
                id: 55,
                name: "thinking",
                createdAt: "2025-08-06T16:07:12.845Z",
                updatedAt: "2025-08-06T16:07:12.845Z",
              },
              comments: [
                {
                  id: 28,
                  content:
                    "Attention, cette modification peut impacter d'autres fonctionnalités.",
                  createdBy: "fccd803b-700c-4018-91d3-8f7addf940b4",
                  createdAt: "2025-08-06T16:07:12.862Z",
                  updatedAt: "2025-08-06T16:07:12.865Z",
                  epicId: null,
                  ticketId: 50,
                },
                {
                  id: 29,
                  content:
                    "La performance est maintenant optimale après les modifications.",
                  createdBy: "096b12ea-166a-4cb0-b901-8a665fb7f459",
                  createdAt: "2025-08-06T16:07:12.859Z",
                  updatedAt: "2025-08-06T16:07:12.866Z",
                  epicId: null,
                  ticketId: 50,
                },
                {
                  id: 30,
                  content:
                    "Excellente analyse du problème, la solution est élégante.",
                  createdBy: "feac2eab-f980-4793-978e-d282a7b92980",
                  createdAt: "2025-08-06T16:07:12.862Z",
                  updatedAt: "2025-08-06T16:07:12.866Z",
                  epicId: null,
                  ticketId: 50,
                },
                {
                  id: 40,
                  content:
                    "<p>Test de mon commentaire : <strong>Test</strong> <em>test</em></p>",
                  createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
                  createdAt: "2025-08-07T13:19:15.383Z",
                  updatedAt: "2025-08-07T13:19:15.383Z",
                  epicId: null,
                  ticketId: 50,
                },
                {
                  id: 39,
                  content:
                    "<p>Salut à <strong>tous, </strong>je suis bientôt un dev</p>",
                  createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
                  createdAt: "2025-08-07T13:18:17.803Z",
                  updatedAt: "2025-08-15T09:46:53.943Z",
                  epicId: null,
                  ticketId: 50,
                },
              ],
            },
            {
              id: 52,
              title: "Créer les fixtures de test",
              description:
                '<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Créer les fixtures de test pour simuler différents scénarios d\'utilisation de l\'application web</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Générer des données fictives représentatives des cas d\'usage courants et exceptionnels</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Inclure des jeux de données variés pour tester la robustesse et la fiabilité de l\'application</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Vérifier la cohérence et la pertinence des données simulées par rapport aux fonctionnalités de l\'application</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Assurer la reproductibilité des tests en garantissant la stabilité et la consistance des fixtures</li></ol>',
              priority: "frozen",
              createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
              assignedTo: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
              epicId: 104,
              statusId: 57,
              createdAt: "2025-08-06T16:07:12.853Z",
              updatedAt: "2025-08-24T08:26:35.745Z",
              status: {
                id: 57,
                name: "in_progress",
                createdAt: "2025-08-06T16:07:12.845Z",
                updatedAt: "2025-08-06T16:07:12.845Z",
              },
              comments: [
                {
                  id: 33,
                  content: "Bug reproductible, je m'en occupe immédiatement.",
                  createdBy: "4b6268b1-5220-4607-9880-2835d184a92b",
                  createdAt: "2025-08-06T16:07:12.859Z",
                  updatedAt: "2025-08-06T16:07:12.867Z",
                  epicId: null,
                  ticketId: 52,
                },
                {
                  id: 34,
                  content: "Tests effectués, le ticket peut être fermé.",
                  createdBy: "78e69e27-7d20-4586-ad34-5ad2145aa7a6",
                  createdAt: "2025-08-06T16:07:12.865Z",
                  updatedAt: "2025-08-06T16:07:12.867Z",
                  epicId: null,
                  ticketId: 52,
                },
                {
                  id: 35,
                  content:
                    "Ce ticket est lié à un autre, je vais les traiter ensemble.",
                  createdBy: "9c6a615a-4218-4e32-876e-010f19b07e88",
                  createdAt: "2025-08-06T16:07:12.864Z",
                  updatedAt: "2025-08-06T16:07:12.868Z",
                  epicId: null,
                  ticketId: 52,
                },
              ],
            },
          ],
        },
        {
          id: 103,
          title: "Tests automatisés",
          description:
            '<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Création de scénarios de tests automatisés pour les fonctionnalités principales de l\'application web</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Mise en place de tests de régression pour garantir le bon fonctionnement des nouvelles fonctionnalités</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Intégration des tests automatisés dans le processus de CI/CD pour assurer une approche continue de la qualité logicielle</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Utilisation d\'outils de test automation tels que Selenium, Cypress ou Puppeteer</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Rédaction de cas de tests détaillés pour assurer une bonne couverture des différentes parties de l\'application</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Collaboration étroite avec les développeurs pour s\'assurer que les tests automatisés capturent les fonctionnalités clés de l\'application</li></ol>',
          priority: "medium",
          createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
          assignedTo: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
          projectSlug: "l-etrange-noel-de-jack",
          statusId: 58,
          createdAt: "2025-08-06T16:07:12.849Z",
          updatedAt: "2025-08-24T15:31:22.420Z",
          status: {
            id: 58,
            name: "done",
            createdAt: "2025-08-06T16:07:12.845Z",
            updatedAt: "2025-08-06T16:07:12.845Z",
          },
          comments: [
            {
              id: 55,
              content: "<p>C'est vraiment un projet de fou</p>",
              createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
              createdAt: "2025-08-18T13:33:29.695Z",
              updatedAt: "2025-08-20T15:22:53.228Z",
              epicId: 103,
              ticketId: null,
            },
            {
              id: 14,
              content:
                "Cette implémentation respecte bien les bonnes pratiques.",
              createdBy: "2685d5f6-6c9e-40f6-ba09-ea14ee618001",
              createdAt: "2025-08-06T16:07:12.858Z",
              updatedAt: "2025-08-06T16:07:12.859Z",
              epicId: 103,
              ticketId: null,
            },
          ],
          tickets: [
            {
              id: 58,
              title: "Effectuer les tests",
              description:
                "<p>Mettre en place des scénarios de tests automatisés pour les fonctionnalités principales de l'application web, incluant la création de tests de régression pour garantir le bon fonctionnement des nouvelles fonctionnalités. Intégrer les tests automatisés dans le processus de CI/CD en utilisant des outils tels que Selenium, Cypress ou Puppeteer. Rédiger des cas de tests détaillés pour assurer une couverture complète de l'application. Collaborer étroitement avec les développeurs pour capturer les fonctionnalités clés de l'application.</p>",
              priority: "medium",
              createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
              assignedTo: "8b91792c-6a11-4a4e-ab92-053c4c3c4ab6",
              epicId: 103,
              statusId: 58,
              createdAt: "2025-08-20T06:55:03.483Z",
              updatedAt: "2025-08-24T15:38:35.945Z",
              status: {
                id: 58,
                name: "done",
                createdAt: "2025-08-06T16:07:12.845Z",
                updatedAt: "2025-08-06T16:07:12.845Z",
              },
              comments: [
                {
                  id: 58,
                  content: "<p>Salut les musclés</p>",
                  createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
                  createdAt: "2025-08-24T15:33:38.463Z",
                  updatedAt: "2025-08-24T15:33:38.463Z",
                  epicId: null,
                  ticketId: 58,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      slug: "next-instagram",
      name: "Next Instagram",
      description:
        "<p>Un nouveau instagram, plus performant avec plus d'options</p>",
      status: "active",
      createdAt: "2025-08-20T12:11:34.337Z",
      updatedAt: "2025-08-20T20:34:58.601Z",
      creator: {
        uuid: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
        username: "Vincent DELAYE",
        email: "vince@mail.com",
        position: "Dev",
        createdAt: "2025-08-06T16:07:12.773Z",
        updatedAt: "2025-08-25T09:25:47.219Z",
      },
      teams: [
        {
          slug: "dev-backend",
          name: "Dev backend",
          createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
          createdAt: "2025-08-06T16:07:12.780Z",
          updatedAt: "2025-08-06T16:07:12.780Z",
        },
        {
          slug: "dev-mobile",
          name: "Dev mobile",
          createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
          createdAt: "2025-08-06T16:07:12.780Z",
          updatedAt: "2025-08-06T16:07:12.780Z",
        },
      ],
      epics: [
        {
          id: 108,
          title: "Effectué la mise en place",
          description:
            '<p><strong style="color: rgb(51, 102, 255);">Objectif de l\'EPIC :</strong></p><ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Mettre en place une architecture robuste et évolutive pour le nouveau Instagram</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Créer une interface utilisateur intuitive et attrayante</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Intégrer toutes les fonctionnalités prévues dans le cahier des charges</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Assurer la sécurité des données des utilisateurs</li></ol>',
          priority: "frozen",
          createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
          assignedTo: "1c9f2542-41ea-4b2e-af04-1541101bf8f2",
          projectSlug: "next-instagram",
          statusId: 55,
          createdAt: "2025-08-20T15:58:00.199Z",
          updatedAt: "2025-08-24T15:14:42.521Z",
          status: {
            id: 55,
            name: "thinking",
            createdAt: "2025-08-06T16:07:12.845Z",
            updatedAt: "2025-08-06T16:07:12.845Z",
          },
          comments: [],
          tickets: [],
        },
      ],
    },
    {
      slug: "trello",
      name: "Trello",
      description: "Un projet de gestion de tâches",
      status: "active",
      createdAt: "2025-08-06T16:07:12.839Z",
      updatedAt: "2025-08-20T12:16:52.838Z",
      creator: {
        uuid: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
        username: "Vincent DELAYE",
        email: "vince@mail.com",
        position: "Dev",
        createdAt: "2025-08-06T16:07:12.773Z",
        updatedAt: "2025-08-25T09:25:47.219Z",
      },
      teams: [
        {
          slug: "dev-frontend",
          name: "Dev frontend",
          createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
          createdAt: "2025-08-06T16:07:12.780Z",
          updatedAt: "2025-08-06T16:07:12.780Z",
        },
        {
          slug: "dev-backend",
          name: "Dev backend",
          createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
          createdAt: "2025-08-06T16:07:12.780Z",
          updatedAt: "2025-08-06T16:07:12.780Z",
        },
      ],
      epics: [],
    },
    {
      slug: "le-seigneur-des-anneaux",
      name: "Le Seigneur des Anneaux",
      description: "Un projet de trilogie épique",
      status: "active",
      createdAt: "2025-08-06T16:07:12.844Z",
      updatedAt: "2025-08-20T12:16:31.221Z",
      creator: {
        uuid: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
        username: "Vincent DELAYE",
        email: "vince@mail.com",
        position: "Dev",
        createdAt: "2025-08-06T16:07:12.773Z",
        updatedAt: "2025-08-25T09:25:47.219Z",
      },
      teams: [
        {
          slug: "dev-frontend",
          name: "Dev frontend",
          createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
          createdAt: "2025-08-06T16:07:12.780Z",
          updatedAt: "2025-08-06T16:07:12.780Z",
        },
        {
          slug: "dev-backend",
          name: "Dev backend",
          createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
          createdAt: "2025-08-06T16:07:12.780Z",
          updatedAt: "2025-08-06T16:07:12.780Z",
        },
        {
          slug: "dev-fullstack",
          name: "Dev fullstack",
          createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
          createdAt: "2025-08-06T16:07:12.780Z",
          updatedAt: "2025-08-06T16:07:12.780Z",
        },
        {
          slug: "qa",
          name: "QA",
          createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
          createdAt: "2025-08-06T16:07:12.780Z",
          updatedAt: "2025-08-06T16:07:12.780Z",
        },
      ],
      epics: [],
    },
    {
      slug: "batman",
      name: "Batman",
      description: "Un projet sur le super-héros de Gotham",
      status: "archived",
      createdAt: "2025-08-06T16:07:12.841Z",
      updatedAt: "2025-08-06T16:07:12.841Z",
      creator: {
        uuid: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
        username: "Vincent DELAYE",
        email: "vince@mail.com",
        position: "Dev",
        createdAt: "2025-08-06T16:07:12.773Z",
        updatedAt: "2025-08-25T09:25:47.219Z",
      },
      teams: [
        {
          slug: "dev-frontend",
          name: "Dev frontend",
          createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
          createdAt: "2025-08-06T16:07:12.780Z",
          updatedAt: "2025-08-06T16:07:12.780Z",
        },
        {
          slug: "dev-backend",
          name: "Dev backend",
          createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
          createdAt: "2025-08-06T16:07:12.780Z",
          updatedAt: "2025-08-06T16:07:12.780Z",
        },
        {
          slug: "dev-fullstack",
          name: "Dev fullstack",
          createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
          createdAt: "2025-08-06T16:07:12.780Z",
          updatedAt: "2025-08-06T16:07:12.780Z",
        },
        {
          slug: "dev-mobile",
          name: "Dev mobile",
          createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
          createdAt: "2025-08-06T16:07:12.780Z",
          updatedAt: "2025-08-06T16:07:12.780Z",
        },
        {
          slug: "qa",
          name: "QA",
          createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
          createdAt: "2025-08-06T16:07:12.780Z",
          updatedAt: "2025-08-06T16:07:12.780Z",
        },
      ],
      epics: [
        {
          id: 100,
          title: "Monitoring et logs",
          description:
            "Implémentation d'un système de cache pour améliorer les performances de l'application.",
          priority: "medium",
          createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
          assignedTo: "ed0f5cf4-e635-4d97-aea1-0a3d324a007e",
          projectSlug: "batman",
          statusId: 55,
          createdAt: "2025-08-06T16:07:12.847Z",
          updatedAt: "2025-08-06T16:07:12.847Z",
          status: {
            id: 55,
            name: "thinking",
            createdAt: "2025-08-06T16:07:12.845Z",
            updatedAt: "2025-08-06T16:07:12.845Z",
          },
          comments: [
            {
              id: 3,
              content:
                "Je propose une approche alternative que nous pourrions explorer.",
              createdBy: "ed0f5cf4-e635-4d97-aea1-0a3d324a007e",
              createdAt: "2025-08-06T16:07:12.847Z",
              updatedAt: "2025-08-06T16:07:12.855Z",
              epicId: 100,
              ticketId: null,
            },
            {
              id: 4,
              content:
                "Attention aux performances sur cette fonctionnalité, il faut optimiser.",
              createdBy: "be5ee083-54d4-4e11-8449-bbcffd9370af",
              createdAt: "2025-08-06T16:07:12.851Z",
              updatedAt: "2025-08-06T16:07:12.855Z",
              epicId: 100,
              ticketId: null,
            },
            {
              id: 5,
              content:
                "Il faudrait peut-être revoir les délais, cela me paraît ambitieux.",
              createdBy: "248457c4-0bec-4141-af23-5b7670ef05d5",
              createdAt: "2025-08-06T16:07:12.847Z",
              updatedAt: "2025-08-06T16:07:12.856Z",
              epicId: 100,
              ticketId: null,
            },
            {
              id: 6,
              content:
                "J'ai quelques questions sur l'implémentation. Pouvons-nous en discuter ?",
              createdBy: "2685d5f6-6c9e-40f6-ba09-ea14ee618001",
              createdAt: "2025-08-06T16:07:12.850Z",
              updatedAt: "2025-08-06T16:07:12.856Z",
              epicId: 100,
              ticketId: null,
            },
            {
              id: 7,
              content:
                "Il faudrait peut-être revoir les délais, cela me paraît ambitieux.",
              createdBy: "18d2c077-a8c4-42c3-a3f8-e3094313a5c0",
              createdAt: "2025-08-06T16:07:12.851Z",
              updatedAt: "2025-08-06T16:07:12.856Z",
              epicId: 100,
              ticketId: null,
            },
          ],
          tickets: [
            {
              id: 46,
              title: "Ajouter les validations côté serveur",
              description:
                "Créer les scripts de migration pour la mise à jour de la base de données.",
              priority: "frozen",
              createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
              assignedTo: "1c9f2542-41ea-4b2e-af04-1541101bf8f2",
              epicId: 100,
              statusId: 59,
              createdAt: "2025-08-06T16:07:12.850Z",
              updatedAt: "2025-08-25T11:44:48.404Z",
              status: {
                id: 59,
                name: "canceled",
                createdAt: "2025-08-06T16:07:12.845Z",
                updatedAt: "2025-08-06T16:07:12.845Z",
              },
              comments: [],
            },
            {
              id: 47,
              title: "Implémenter le cache Redis",
              description:
                "Mettre à jour la documentation technique pour refléter les derniers changements.",
              priority: "frozen",
              createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
              assignedTo: null,
              epicId: 100,
              statusId: 59,
              createdAt: "2025-08-06T16:07:12.851Z",
              updatedAt: "2025-08-25T11:44:53.164Z",
              status: {
                id: 59,
                name: "canceled",
                createdAt: "2025-08-06T16:07:12.845Z",
                updatedAt: "2025-08-06T16:07:12.845Z",
              },
              comments: [
                {
                  id: 18,
                  content:
                    "J'ai besoin de plus d'informations pour reproduire le bug.",
                  createdBy: "13cf119c-883a-4d98-aa5d-c8d5a0566e5b",
                  createdAt: "2025-08-06T16:07:12.854Z",
                  updatedAt: "2025-08-06T16:07:12.861Z",
                  epicId: null,
                  ticketId: 47,
                },
                {
                  id: 19,
                  content:
                    "Ce ticket est lié à un autre, je vais les traiter ensemble.",
                  createdBy: "8e4b1c74-b19c-46f5-a4eb-582c77335f48",
                  createdAt: "2025-08-06T16:07:12.858Z",
                  updatedAt: "2025-08-06T16:07:12.862Z",
                  epicId: null,
                  ticketId: 47,
                },
              ],
            },
            {
              id: 48,
              title: "Créer les migrations de base de données",
              description:
                "Ajouter des validations robustes pour tous les champs de saisie utilisateur.",
              priority: "low",
              createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
              assignedTo: null,
              epicId: 100,
              statusId: 57,
              createdAt: "2025-08-06T16:07:12.852Z",
              updatedAt: "2025-08-25T11:44:57.711Z",
              status: {
                id: 57,
                name: "in_progress",
                createdAt: "2025-08-06T16:07:12.845Z",
                updatedAt: "2025-08-06T16:07:12.845Z",
              },
              comments: [
                {
                  id: 20,
                  content: "Tests effectués, le ticket peut être fermé.",
                  createdBy: "65e70f31-faca-4f55-b1eb-17fc775f61d6",
                  createdAt: "2025-08-06T16:07:12.855Z",
                  updatedAt: "2025-08-06T16:07:12.862Z",
                  epicId: null,
                  ticketId: 48,
                },
                {
                  id: 21,
                  content:
                    "Excellente analyse du problème, la solution est élégante.",
                  createdBy: "3f4f3651-7ff5-4d41-bc4e-14de9b62de3d",
                  createdAt: "2025-08-06T16:07:12.862Z",
                  updatedAt: "2025-08-06T16:07:12.862Z",
                  epicId: null,
                  ticketId: 48,
                },
                {
                  id: 22,
                  content:
                    "Bonne description du problème, cela facilite la résolution.",
                  createdBy: "69bff0e6-d269-4bd3-9f80-41d37a88caa6",
                  createdAt: "2025-08-06T16:07:12.858Z",
                  updatedAt: "2025-08-06T16:07:12.863Z",
                  epicId: null,
                  ticketId: 48,
                },
                {
                  id: 23,
                  content:
                    "Tests unitaires ajoutés pour couvrir ce cas d'usage.",
                  createdBy: "3f4f3651-7ff5-4d41-bc4e-14de9b62de3d",
                  createdAt: "2025-08-06T16:07:12.863Z",
                  updatedAt: "2025-08-06T16:07:12.863Z",
                  epicId: null,
                  ticketId: 48,
                },
                {
                  id: 24,
                  content:
                    "Cette amélioration va vraiment aider les utilisateurs finaux.",
                  createdBy: "d9d0fe32-9069-406c-a0eb-1e4bf34231ec",
                  createdAt: "2025-08-06T16:07:12.859Z",
                  updatedAt: "2025-08-06T16:07:12.864Z",
                  epicId: null,
                  ticketId: 48,
                },
                {
                  id: 41,
                  content:
                    '<p>C\'est un test</p><p><img src="data:image/png;base64,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"></p>',
                  createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
                  createdAt: "2025-08-07T13:21:28.505Z",
                  updatedAt: "2025-08-07T13:21:28.505Z",
                  epicId: null,
                  ticketId: 48,
                },
              ],
            },
            {
              id: 53,
              title: "Salut les gars",
              description: "<p>i</p>",
              priority: "frozen",
              createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
              assignedTo: null,
              epicId: 100,
              statusId: 55,
              createdAt: "2025-08-07T11:02:48.811Z",
              updatedAt: "2025-08-07T11:02:48.811Z",
              status: {
                id: 55,
                name: "thinking",
                createdAt: "2025-08-06T16:07:12.845Z",
                updatedAt: "2025-08-06T16:07:12.845Z",
              },
              comments: [],
            },
            {
              id: 54,
              title: "Test test, encore un test",
              description: "<p>a</p>",
              priority: "frozen",
              createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
              assignedTo: null,
              epicId: 100,
              statusId: 55,
              createdAt: "2025-08-07T11:52:45.115Z",
              updatedAt: "2025-08-07T11:52:45.115Z",
              status: {
                id: 55,
                name: "thinking",
                createdAt: "2025-08-06T16:07:12.845Z",
                updatedAt: "2025-08-06T16:07:12.845Z",
              },
              comments: [],
            },
          ],
        },
        {
          id: 101,
          title: "Système de cache",
          description:
            "Mise en place d'un système de monitoring et de logs pour faciliter le débogage.",
          priority: "low",
          createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
          assignedTo: "65e70f31-faca-4f55-b1eb-17fc775f61d6",
          projectSlug: "batman",
          statusId: 56,
          createdAt: "2025-08-06T16:07:12.848Z",
          updatedAt: "2025-08-06T16:07:12.848Z",
          status: {
            id: 56,
            name: "ready",
            createdAt: "2025-08-06T16:07:12.845Z",
            updatedAt: "2025-08-06T16:07:12.845Z",
          },
          comments: [
            {
              id: 8,
              content:
                "La documentation est très bien rédigée, merci pour le détail.",
              createdBy: "8b91792c-6a11-4a4e-ab92-053c4c3c4ab6",
              createdAt: "2025-08-06T16:07:12.849Z",
              updatedAt: "2025-08-06T16:07:12.857Z",
              epicId: 101,
              ticketId: null,
            },
            {
              id: 9,
              content:
                "Je vais faire une review détaillée et revenir vers vous.",
              createdBy: "9c6a615a-4218-4e32-876e-010f19b07e88",
              createdAt: "2025-08-06T16:07:12.857Z",
              updatedAt: "2025-08-06T16:07:12.857Z",
              epicId: 101,
              ticketId: null,
            },
            {
              id: 10,
              content:
                "Excellent retour des utilisateurs sur cette fonctionnalité !",
              createdBy: "28394365-05f3-45fd-9e65-953348a7ded3",
              createdAt: "2025-08-06T16:07:12.850Z",
              updatedAt: "2025-08-06T16:07:12.858Z",
              epicId: 101,
              ticketId: null,
            },
            {
              id: 11,
              content:
                "Il faudrait peut-être ajouter des logs pour faciliter le debugging.",
              createdBy: "be5ee083-54d4-4e11-8449-bbcffd9370af",
              createdAt: "2025-08-06T16:07:12.853Z",
              updatedAt: "2025-08-06T16:07:12.858Z",
              epicId: 101,
              ticketId: null,
            },
            {
              id: 52,
              content: "<p>Salut à tous</p>",
              createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
              createdAt: "2025-08-08T12:15:37.137Z",
              updatedAt: "2025-08-08T12:15:37.137Z",
              epicId: 101,
              ticketId: null,
            },
          ],
          tickets: [
            {
              id: 49,
              title: "Ajouter les logs de sécurité",
              description:
                "Configurer correctement toutes les variables d'environnement nécessaires.",
              priority: "medium",
              createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
              assignedTo: "d412557d-6edb-4b3f-bdfd-8f784cf0aaec",
              epicId: 101,
              statusId: 57,
              createdAt: "2025-08-06T16:07:12.852Z",
              updatedAt: "2025-08-25T06:54:13.810Z",
              status: {
                id: 57,
                name: "in_progress",
                createdAt: "2025-08-06T16:07:12.845Z",
                updatedAt: "2025-08-06T16:07:12.845Z",
              },
              comments: [
                {
                  id: 25,
                  content: "La correction est déployée, pouvez-vous vérifier ?",
                  createdBy: "fccd803b-700c-4018-91d3-8f7addf940b4",
                  createdAt: "2025-08-06T16:07:12.858Z",
                  updatedAt: "2025-08-06T16:07:12.864Z",
                  epicId: null,
                  ticketId: 49,
                },
                {
                  id: 26,
                  content: "La correction est déployée, pouvez-vous vérifier ?",
                  createdBy: "d9d0fe32-9069-406c-a0eb-1e4bf34231ec",
                  createdAt: "2025-08-06T16:07:12.855Z",
                  updatedAt: "2025-08-06T16:07:12.864Z",
                  epicId: null,
                  ticketId: 49,
                },
                {
                  id: 27,
                  content: "Ce ticket peut être marqué comme résolu.",
                  createdBy: "d412557d-6edb-4b3f-bdfd-8f784cf0aaec",
                  createdAt: "2025-08-06T16:07:12.864Z",
                  updatedAt: "2025-08-06T16:07:12.865Z",
                  epicId: null,
                  ticketId: 49,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
} as { projects: Project[] };

describe("ProjectsList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  afterEach(() => {
    cleanup();
  });

  it("should render the project list", async () => {
    vi.spyOn(projectApi, "fetchProjects").mockResolvedValue(MOCK_PROJECTS);

    render(
      <BrowserRouter>
        <ProjectsList />
      </BrowserRouter>
    );

    const projectsList = await screen.findAllByTestId("project-card");
    expect(projectsList).toHaveLength(MOCK_PROJECTS.projects.length);

    MOCK_PROJECTS.projects.forEach((project) => {
      expect(screen.getByText(project.name)).toBeInTheDocument();
    });
  });

  it("should render the project list statistics", async () => {
    vi.spyOn(projectApi, "fetchProjects").mockResolvedValue(MOCK_PROJECTS);

    render(
      <BrowserRouter>
        <ProjectsList />
      </BrowserRouter>
    );

    const totalProjects = await screen.findByTestId("total-projects");
    const totalActiveProjects = await screen.findByTestId("active-projects");
    const totalEpics = await screen.findByTestId("total-epics");
    const totalTeams = await screen.findByTestId("total-teams");

    expect(totalProjects).toHaveTextContent(
      MOCK_PROJECTS.projects.length.toString()
    );
    expect(totalActiveProjects).toHaveTextContent(
      MOCK_PROJECTS.projects
        .filter((p) => p.status === "active")
        .length.toString()
    );
    expect(totalEpics).toHaveTextContent(
      MOCK_PROJECTS.projects
        .reduce((acc, project) => acc + (project.epics?.length || 0), 0)
        .toString()
    );
    expect(totalTeams).toHaveTextContent(
      MOCK_PROJECTS.projects
        .reduce((acc, project) => acc + (project.teams?.length || 0), 0)
        .toString()
    );
  });
});
