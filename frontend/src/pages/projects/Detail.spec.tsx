import { describe, it, vi, beforeEach, expect, afterEach } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import ProjectDetail from "./Detail";
import { fetchProjectDetail } from "../../api/projects";
import { BrowserRouter } from "react-router-dom";
import { fetchTeams } from "../../api/teams";
import { fetchUsersByProject } from "../../api/users";
import { fetchEpicStatus } from "../../api/status";

// Y a t il des librairies qui nous aides pour tester des composants react ?
// Comment faire en sorte que le test soit isolé et ne depende pas d'une api externe ?
// Comment mocker les appels API dans les tests unitaires ?

// Mock de l'API pour contrôler les données

const MOCK_PROJECT_RESPONSE = {
  project: {
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
        id: 102,
        title: "Optimisation des performances",
        description:
          '<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Optimiser les requêtes SQL pour réduire le temps de chargement des données</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Minimiser les fichiers CSS et JS pour améliorer la vitesse de chargement des pages</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Mettre en place des techniques de caching pour diminuer la charge sur le serveur</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Optimiser les images pour réduire leur taille et améliorer le temps de chargement</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Évaluer et améliorer la performance globale de l\'application web en identifiant les goulets d\'étranglement</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Effectuer des tests de charge pour s\'assurer que l\'application peut gérer un grand nombre d\'utilisateurs simultanément</li></ol>',
        priority: "high",
        createdBy: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
        assignedTo: "4b6268b1-5220-4607-9880-2835d184a92b",
        projectSlug: "l-etrange-noel-de-jack",
        statusId: 57,
        createdAt: "2025-08-06T16:07:12.848Z",
        updatedAt: "2025-08-18T11:25:02.557Z",
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
                content: "Il faudrait documenter cette solution pour l'équipe.",
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
            content: "Cette implémentation respecte bien les bonnes pratiques.",
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
};

const MOCK_TEAMS_RESPONSE = {
  teams: [
    {
      slug: "dev-frontend",
      name: "Dev frontend",
      createdAt: "2025-08-06T16:07:12.780Z",
      updatedAt: "2025-08-06T16:07:12.780Z",
      creator: {
        uuid: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
        username: "Vincent DELAYE",
        email: "vince@mail.com",
        position: "Dev",
        createdAt: "2025-08-06T16:07:12.773Z",
        updatedAt: "2025-08-25T09:25:47.219Z",
      },
      members: [
        {
          uuid: "d412557d-6edb-4b3f-bdfd-8f784cf0aaec",
          username: "Acacie Blanchard",
          email: "violette_leroux76@hotmail.fr",
          position: "Superviseur des directives national",
          createdAt: "2025-08-06T16:07:12.796Z",
          updatedAt: "2025-08-06T16:07:12.796Z",
        },
        {
          uuid: "873d1604-ecf0-4802-ad5c-5bd98fbf8aa7",
          username: "Antide Faure",
          email: "genevieve.leroy10@hotmail.fr",
          position: "Designer de l'intranet national",
          createdAt: "2025-08-06T16:07:12.805Z",
          updatedAt: "2025-08-06T16:07:12.805Z",
        },
        {
          uuid: "85b0bcf8-9642-4ce0-97b5-6a8b2ae6fab2",
          username: "Lucas Fabre",
          email: "martin.breton10@gmail.com",
          position: "Agent de la mobilité futur",
          createdAt: "2025-08-06T16:07:12.807Z",
          updatedAt: "2025-08-06T16:07:12.807Z",
        },
        {
          uuid: "8b91792c-6a11-4a4e-ab92-053c4c3c4ab6",
          username: "Adélie Berger",
          email: "audran16@hotmail.fr",
          position: "Executif de l'identité interne",
          createdAt: "2025-08-06T16:07:12.809Z",
          updatedAt: "2025-08-06T16:07:12.809Z",
        },
        {
          uuid: "d9d0fe32-9069-406c-a0eb-1e4bf34231ec",
          username: "Christophe Mathieu",
          email: "amandine48@gmail.com",
          position: "Manager de l'identité central",
          createdAt: "2025-08-06T16:07:12.814Z",
          updatedAt: "2025-08-06T16:07:12.814Z",
        },
        {
          uuid: "847ad4f3-f495-4b1b-b931-d37377d346e7",
          username: "Foulques Gerard",
          email: "garance.legall@yahoo.fr",
          position: "Architecte de la réponse central",
          createdAt: "2025-08-06T16:07:12.815Z",
          updatedAt: "2025-08-06T16:07:12.815Z",
        },
        {
          uuid: "ed0f5cf4-e635-4d97-aea1-0a3d324a007e",
          username: "Eva Guyot",
          email: "rodrigue29@yahoo.fr",
          position: "Producteur de configuration international",
          createdAt: "2025-08-06T16:07:12.817Z",
          updatedAt: "2025-08-06T16:07:12.817Z",
        },
        {
          uuid: "2685d5f6-6c9e-40f6-ba09-ea14ee618001",
          username: "Carloman Bourgeois",
          email: "bartimee6@gmail.com",
          position: "Developpeur de la mobilité international",
          createdAt: "2025-08-06T16:07:12.818Z",
          updatedAt: "2025-08-06T16:07:12.818Z",
        },
        {
          uuid: "28394365-05f3-45fd-9e65-953348a7ded3",
          username: "Odette Meyer",
          email: "marianne_carre65@hotmail.fr",
          position: "Stagiaire du web principal",
          createdAt: "2025-08-06T16:07:12.819Z",
          updatedAt: "2025-08-06T16:07:12.819Z",
        },
        {
          uuid: "9a9a472e-0c3a-49e1-9d7d-7487ff2167cf",
          username: "Bertrand Carpentier",
          email: "ophelie_durand@hotmail.fr",
          position: "Technicien des applications futur",
          createdAt: "2025-08-06T16:07:12.820Z",
          updatedAt: "2025-08-06T16:07:12.820Z",
        },
        {
          uuid: "8709459e-dcb3-426c-9fcc-54db7b53a7c6",
          username: "Martine Prevost",
          email: "amiel.meyer@gmail.com",
          position: "Superviseur des interactions principal",
          createdAt: "2025-08-06T16:07:12.823Z",
          updatedAt: "2025-08-06T16:07:12.823Z",
        },
        {
          uuid: "096b12ea-166a-4cb0-b901-8a665fb7f459",
          username: "Adrastée Morin",
          email: "apolline92@gmail.com",
          position: "Architecte de programme international",
          createdAt: "2025-08-06T16:07:12.824Z",
          updatedAt: "2025-08-06T16:07:12.824Z",
        },
        {
          uuid: "3f4f3651-7ff5-4d41-bc4e-14de9b62de3d",
          username: "Maurice Dumas",
          email: "colin.moulin43@hotmail.fr",
          position: "Agent des applications national",
          createdAt: "2025-08-06T16:07:12.825Z",
          updatedAt: "2025-08-06T16:07:12.825Z",
        },
        {
          uuid: "c0a9b323-97f6-4931-a62f-cecaeb99acf8",
          username: "Caroline Bernard",
          email: "armel_carre@yahoo.fr",
          position: "Assistant de l'identité futur",
          createdAt: "2025-08-06T16:07:12.827Z",
          updatedAt: "2025-08-06T16:07:12.827Z",
        },
        {
          uuid: "be750c9d-a11a-4715-b773-ac6cfbdc340c",
          username: "Jehanne Giraud",
          email: "laurine57@gmail.com",
          position: "Ingenieur de la tactique direct",
          createdAt: "2025-08-06T16:07:12.829Z",
          updatedAt: "2025-08-06T16:07:12.829Z",
        },
        {
          uuid: "be5ee083-54d4-4e11-8449-bbcffd9370af",
          username: "Dr Antonine Martinez",
          email: "aurelle87@gmail.com",
          position: "Stagiaire de la marque mondial",
          createdAt: "2025-08-06T16:07:12.830Z",
          updatedAt: "2025-08-06T16:07:12.830Z",
        },
        {
          uuid: "3cc57282-b8d7-4273-a897-0d2c5eae388e",
          username: "Sidoine Renault",
          email: "innocent.andre12@yahoo.fr",
          position: "Superviseur de marque direct",
          createdAt: "2025-08-06T16:07:12.834Z",
          updatedAt: "2025-08-06T16:07:12.834Z",
        },
        {
          uuid: "78e69e27-7d20-4586-ad34-5ad2145aa7a6",
          username: "Mlle Huguette Chevalier",
          email: "audran_guillaume@hotmail.fr",
          position: "Specialiste de configuration national",
          createdAt: "2025-08-06T16:07:12.835Z",
          updatedAt: "2025-08-06T16:07:12.835Z",
        },
      ],
    },
    {
      slug: "dev-backend",
      name: "Dev backend",
      createdAt: "2025-08-06T16:07:12.780Z",
      updatedAt: "2025-08-06T16:07:12.780Z",
      creator: {
        uuid: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
        username: "Vincent DELAYE",
        email: "vince@mail.com",
        position: "Dev",
        createdAt: "2025-08-06T16:07:12.773Z",
        updatedAt: "2025-08-25T09:25:47.219Z",
      },
      members: [
        {
          uuid: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
          username: "Vincent DELAYE",
          email: "vince@mail.com",
          position: "Dev",
          createdAt: "2025-08-06T16:07:12.773Z",
          updatedAt: "2025-08-25T09:25:47.219Z",
        },
        {
          uuid: "d3c7df25-62c7-4cf7-8616-fe53ff96565a",
          username: "Agapet Sanchez",
          email: "ferdinand.aubert38@yahoo.fr",
          position: "Directeur de configuration interne",
          createdAt: "2025-08-06T16:07:12.798Z",
          updatedAt: "2025-08-06T16:07:12.798Z",
        },
        {
          uuid: "b9fd4260-0f7b-4347-ac7d-d3f6e4076c84",
          username: "Aimable Poirier",
          email: "anatolie.leroux7@yahoo.fr",
          position: "Ingenieur des infrastructures client",
          createdAt: "2025-08-06T16:07:12.802Z",
          updatedAt: "2025-08-06T16:07:12.802Z",
        },
        {
          uuid: "4b6268b1-5220-4607-9880-2835d184a92b",
          username: "Anaïs Moreau",
          email: "amante_collet23@yahoo.fr",
          position: "Stagiaire du marketing régional",
          createdAt: "2025-08-06T16:07:12.803Z",
          updatedAt: "2025-08-06T16:07:12.803Z",
        },
        {
          uuid: "873d1604-ecf0-4802-ad5c-5bd98fbf8aa7",
          username: "Antide Faure",
          email: "genevieve.leroy10@hotmail.fr",
          position: "Designer de l'intranet national",
          createdAt: "2025-08-06T16:07:12.805Z",
          updatedAt: "2025-08-06T16:07:12.805Z",
        },
        {
          uuid: "1c9f2542-41ea-4b2e-af04-1541101bf8f2",
          username: "Fabien Lefevre",
          email: "anne_martin@yahoo.fr",
          position: "Administrateur des marchés principal",
          createdAt: "2025-08-06T16:07:12.811Z",
          updatedAt: "2025-08-06T16:07:12.811Z",
        },
        {
          uuid: "bb3bee29-0d9d-4560-8817-10a35ddae80c",
          username: "Aubertine Pierre",
          email: "marine.noel50@hotmail.fr",
          position: "Executif de la réponse national",
          createdAt: "2025-08-06T16:07:12.813Z",
          updatedAt: "2025-08-06T16:07:12.813Z",
        },
        {
          uuid: "d9d0fe32-9069-406c-a0eb-1e4bf34231ec",
          username: "Christophe Mathieu",
          email: "amandine48@gmail.com",
          position: "Manager de l'identité central",
          createdAt: "2025-08-06T16:07:12.814Z",
          updatedAt: "2025-08-06T16:07:12.814Z",
        },
        {
          uuid: "28394365-05f3-45fd-9e65-953348a7ded3",
          username: "Odette Meyer",
          email: "marianne_carre65@hotmail.fr",
          position: "Stagiaire du web principal",
          createdAt: "2025-08-06T16:07:12.819Z",
          updatedAt: "2025-08-06T16:07:12.819Z",
        },
        {
          uuid: "70566565-22f1-41a8-8883-86ec0ce7aec8",
          username: "Adel Dumont",
          email: "esther3@yahoo.fr",
          position: "Architecte de marque national",
          createdAt: "2025-08-06T16:07:12.822Z",
          updatedAt: "2025-08-06T16:07:12.822Z",
        },
        {
          uuid: "c0a9b323-97f6-4931-a62f-cecaeb99acf8",
          username: "Caroline Bernard",
          email: "armel_carre@yahoo.fr",
          position: "Assistant de l'identité futur",
          createdAt: "2025-08-06T16:07:12.827Z",
          updatedAt: "2025-08-06T16:07:12.827Z",
        },
        {
          uuid: "18d2c077-a8c4-42c3-a3f8-e3094313a5c0",
          username: "Bénédicte Dumont",
          email: "venance93@hotmail.fr",
          position: "Manager de marque humain",
          createdAt: "2025-08-06T16:07:12.828Z",
          updatedAt: "2025-08-06T16:07:12.828Z",
        },
        {
          uuid: "be5ee083-54d4-4e11-8449-bbcffd9370af",
          username: "Dr Antonine Martinez",
          email: "aurelle87@gmail.com",
          position: "Stagiaire de la marque mondial",
          createdAt: "2025-08-06T16:07:12.830Z",
          updatedAt: "2025-08-06T16:07:12.830Z",
        },
        {
          uuid: "9c6a615a-4218-4e32-876e-010f19b07e88",
          username: "Jason Garcia",
          email: "emmanuel_morel@yahoo.fr",
          position: "Producteur de la sécurité régional",
          createdAt: "2025-08-06T16:07:12.832Z",
          updatedAt: "2025-08-06T16:07:12.832Z",
        },
        {
          uuid: "65e70f31-faca-4f55-b1eb-17fc775f61d6",
          username: "Prof Michel Boyer",
          email: "adrien_poirier25@gmail.com",
          position: "Architecte des infrastructures mondial",
          createdAt: "2025-08-06T16:07:12.833Z",
          updatedAt: "2025-08-06T16:07:12.833Z",
        },
        {
          uuid: "3cc57282-b8d7-4273-a897-0d2c5eae388e",
          username: "Sidoine Renault",
          email: "innocent.andre12@yahoo.fr",
          position: "Superviseur de marque direct",
          createdAt: "2025-08-06T16:07:12.834Z",
          updatedAt: "2025-08-06T16:07:12.834Z",
        },
      ],
    },
    {
      slug: "dev-fullstack",
      name: "Dev fullstack",
      createdAt: "2025-08-06T16:07:12.780Z",
      updatedAt: "2025-08-06T16:07:12.780Z",
      creator: {
        uuid: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
        username: "Vincent DELAYE",
        email: "vince@mail.com",
        position: "Dev",
        createdAt: "2025-08-06T16:07:12.773Z",
        updatedAt: "2025-08-25T09:25:47.219Z",
      },
      members: [
        {
          uuid: "173a9b09-a460-40ca-ad4f-4cf1c75547fc",
          username: "Prof Amélien Fontaine",
          email: "aurelienne.francois@hotmail.fr",
          position: "Developpeur des comptes interne",
          createdAt: "2025-08-06T16:07:12.788Z",
          updatedAt: "2025-08-06T16:07:12.788Z",
        },
        {
          uuid: "d412557d-6edb-4b3f-bdfd-8f784cf0aaec",
          username: "Acacie Blanchard",
          email: "violette_leroux76@hotmail.fr",
          position: "Superviseur des directives national",
          createdAt: "2025-08-06T16:07:12.796Z",
          updatedAt: "2025-08-06T16:07:12.796Z",
        },
        {
          uuid: "d3c7df25-62c7-4cf7-8616-fe53ff96565a",
          username: "Agapet Sanchez",
          email: "ferdinand.aubert38@yahoo.fr",
          position: "Directeur de configuration interne",
          createdAt: "2025-08-06T16:07:12.798Z",
          updatedAt: "2025-08-06T16:07:12.798Z",
        },
        {
          uuid: "7880c3cf-f14e-413b-a06a-5331b80655f2",
          username: "Doriane Lacroix",
          email: "athina.gaillard1@gmail.com",
          position: "Ingenieur des métriques régional",
          createdAt: "2025-08-06T16:07:12.800Z",
          updatedAt: "2025-08-06T16:07:12.800Z",
        },
        {
          uuid: "8e4b1c74-b19c-46f5-a4eb-582c77335f48",
          username: "Francette Dupuis",
          email: "dorothee44@gmail.com",
          position: "Consultant des interactions national",
          createdAt: "2025-08-06T16:07:12.806Z",
          updatedAt: "2025-08-06T16:07:12.806Z",
        },
        {
          uuid: "bb3bee29-0d9d-4560-8817-10a35ddae80c",
          username: "Aubertine Pierre",
          email: "marine.noel50@hotmail.fr",
          position: "Executif de la réponse national",
          createdAt: "2025-08-06T16:07:12.813Z",
          updatedAt: "2025-08-06T16:07:12.813Z",
        },
        {
          uuid: "2685d5f6-6c9e-40f6-ba09-ea14ee618001",
          username: "Carloman Bourgeois",
          email: "bartimee6@gmail.com",
          position: "Developpeur de la mobilité international",
          createdAt: "2025-08-06T16:07:12.818Z",
          updatedAt: "2025-08-06T16:07:12.818Z",
        },
        {
          uuid: "feac2eab-f980-4793-978e-d282a7b92980",
          username: "Athina Hubert",
          email: "blaise33@hotmail.fr",
          position: "Ingenieur de la marque client",
          createdAt: "2025-08-06T16:07:12.821Z",
          updatedAt: "2025-08-06T16:07:12.821Z",
        },
        {
          uuid: "8709459e-dcb3-426c-9fcc-54db7b53a7c6",
          username: "Martine Prevost",
          email: "amiel.meyer@gmail.com",
          position: "Superviseur des interactions principal",
          createdAt: "2025-08-06T16:07:12.823Z",
          updatedAt: "2025-08-06T16:07:12.823Z",
        },
        {
          uuid: "3f4f3651-7ff5-4d41-bc4e-14de9b62de3d",
          username: "Maurice Dumas",
          email: "colin.moulin43@hotmail.fr",
          position: "Agent des applications national",
          createdAt: "2025-08-06T16:07:12.825Z",
          updatedAt: "2025-08-06T16:07:12.825Z",
        },
        {
          uuid: "c0a9b323-97f6-4931-a62f-cecaeb99acf8",
          username: "Caroline Bernard",
          email: "armel_carre@yahoo.fr",
          position: "Assistant de l'identité futur",
          createdAt: "2025-08-06T16:07:12.827Z",
          updatedAt: "2025-08-06T16:07:12.827Z",
        },
        {
          uuid: "18d2c077-a8c4-42c3-a3f8-e3094313a5c0",
          username: "Bénédicte Dumont",
          email: "venance93@hotmail.fr",
          position: "Manager de marque humain",
          createdAt: "2025-08-06T16:07:12.828Z",
          updatedAt: "2025-08-06T16:07:12.828Z",
        },
        {
          uuid: "be750c9d-a11a-4715-b773-ac6cfbdc340c",
          username: "Jehanne Giraud",
          email: "laurine57@gmail.com",
          position: "Ingenieur de la tactique direct",
          createdAt: "2025-08-06T16:07:12.829Z",
          updatedAt: "2025-08-06T16:07:12.829Z",
        },
        {
          uuid: "65e70f31-faca-4f55-b1eb-17fc775f61d6",
          username: "Prof Michel Boyer",
          email: "adrien_poirier25@gmail.com",
          position: "Architecte des infrastructures mondial",
          createdAt: "2025-08-06T16:07:12.833Z",
          updatedAt: "2025-08-06T16:07:12.833Z",
        },
        {
          uuid: "78e69e27-7d20-4586-ad34-5ad2145aa7a6",
          username: "Mlle Huguette Chevalier",
          email: "audran_guillaume@hotmail.fr",
          position: "Specialiste de configuration national",
          createdAt: "2025-08-06T16:07:12.835Z",
          updatedAt: "2025-08-06T16:07:12.835Z",
        },
        {
          uuid: "56c2b1f6-3376-42ff-b42a-9838552a23ed",
          username: "Dr Reybaud Benoit",
          email: "armine.dumas39@yahoo.fr",
          position: "Directeur de l'identité client",
          createdAt: "2025-08-06T16:07:12.838Z",
          updatedAt: "2025-08-06T16:07:12.838Z",
        },
      ],
    },
    {
      slug: "dev-mobile",
      name: "Dev mobile",
      createdAt: "2025-08-06T16:07:12.780Z",
      updatedAt: "2025-08-06T16:07:12.780Z",
      creator: {
        uuid: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
        username: "Vincent DELAYE",
        email: "vince@mail.com",
        position: "Dev",
        createdAt: "2025-08-06T16:07:12.773Z",
        updatedAt: "2025-08-25T09:25:47.219Z",
      },
      members: [
        {
          uuid: "173a9b09-a460-40ca-ad4f-4cf1c75547fc",
          username: "Prof Amélien Fontaine",
          email: "aurelienne.francois@hotmail.fr",
          position: "Developpeur des comptes interne",
          createdAt: "2025-08-06T16:07:12.788Z",
          updatedAt: "2025-08-06T16:07:12.788Z",
        },
        {
          uuid: "248457c4-0bec-4141-af23-5b7670ef05d5",
          username: "Gertrude Dubois",
          email: "clotilde.sanchez87@yahoo.fr",
          position: "Technicien de la qualité mondial",
          createdAt: "2025-08-06T16:07:12.794Z",
          updatedAt: "2025-08-06T16:07:12.794Z",
        },
        {
          uuid: "873d1604-ecf0-4802-ad5c-5bd98fbf8aa7",
          username: "Antide Faure",
          email: "genevieve.leroy10@hotmail.fr",
          position: "Designer de l'intranet national",
          createdAt: "2025-08-06T16:07:12.805Z",
          updatedAt: "2025-08-06T16:07:12.805Z",
        },
        {
          uuid: "8e4b1c74-b19c-46f5-a4eb-582c77335f48",
          username: "Francette Dupuis",
          email: "dorothee44@gmail.com",
          position: "Consultant des interactions national",
          createdAt: "2025-08-06T16:07:12.806Z",
          updatedAt: "2025-08-06T16:07:12.806Z",
        },
        {
          uuid: "8b91792c-6a11-4a4e-ab92-053c4c3c4ab6",
          username: "Adélie Berger",
          email: "audran16@hotmail.fr",
          position: "Executif de l'identité interne",
          createdAt: "2025-08-06T16:07:12.809Z",
          updatedAt: "2025-08-06T16:07:12.809Z",
        },
        {
          uuid: "fafc2307-e424-4652-a212-7120dd7d967c",
          username: "Jade Benoit",
          email: "cesaire_dumas@gmail.com",
          position: "Designer des applications client",
          createdAt: "2025-08-06T16:07:12.810Z",
          updatedAt: "2025-08-06T16:07:12.810Z",
        },
        {
          uuid: "1c9f2542-41ea-4b2e-af04-1541101bf8f2",
          username: "Fabien Lefevre",
          email: "anne_martin@yahoo.fr",
          position: "Administrateur des marchés principal",
          createdAt: "2025-08-06T16:07:12.811Z",
          updatedAt: "2025-08-06T16:07:12.811Z",
        },
        {
          uuid: "2685d5f6-6c9e-40f6-ba09-ea14ee618001",
          username: "Carloman Bourgeois",
          email: "bartimee6@gmail.com",
          position: "Developpeur de la mobilité international",
          createdAt: "2025-08-06T16:07:12.818Z",
          updatedAt: "2025-08-06T16:07:12.818Z",
        },
        {
          uuid: "feac2eab-f980-4793-978e-d282a7b92980",
          username: "Athina Hubert",
          email: "blaise33@hotmail.fr",
          position: "Ingenieur de la marque client",
          createdAt: "2025-08-06T16:07:12.821Z",
          updatedAt: "2025-08-06T16:07:12.821Z",
        },
        {
          uuid: "70566565-22f1-41a8-8883-86ec0ce7aec8",
          username: "Adel Dumont",
          email: "esther3@yahoo.fr",
          position: "Architecte de marque national",
          createdAt: "2025-08-06T16:07:12.822Z",
          updatedAt: "2025-08-06T16:07:12.822Z",
        },
        {
          uuid: "be750c9d-a11a-4715-b773-ac6cfbdc340c",
          username: "Jehanne Giraud",
          email: "laurine57@gmail.com",
          position: "Ingenieur de la tactique direct",
          createdAt: "2025-08-06T16:07:12.829Z",
          updatedAt: "2025-08-06T16:07:12.829Z",
        },
        {
          uuid: "3cc57282-b8d7-4273-a897-0d2c5eae388e",
          username: "Sidoine Renault",
          email: "innocent.andre12@yahoo.fr",
          position: "Superviseur de marque direct",
          createdAt: "2025-08-06T16:07:12.834Z",
          updatedAt: "2025-08-06T16:07:12.834Z",
        },
        {
          uuid: "13cf119c-883a-4d98-aa5d-c8d5a0566e5b",
          username: "Prof Francisque Fleury",
          email: "simon.dupont46@yahoo.fr",
          position: "Superviseur des marchés régional",
          createdAt: "2025-08-06T16:07:12.837Z",
          updatedAt: "2025-08-06T16:07:12.837Z",
        },
      ],
    },
    {
      slug: "qa",
      name: "QA",
      createdAt: "2025-08-06T16:07:12.780Z",
      updatedAt: "2025-08-06T16:07:12.780Z",
      creator: {
        uuid: "0e6e9182-cf78-43db-b880-23f34c72e7ad",
        username: "Vincent DELAYE",
        email: "vince@mail.com",
        position: "Dev",
        createdAt: "2025-08-06T16:07:12.773Z",
        updatedAt: "2025-08-25T09:25:47.219Z",
      },
      members: [
        {
          uuid: "7aba6182-2cee-4a93-9d0e-7abe5c633564",
          username: "Dr Odette Bertrand",
          email: "francine_barbier7@gmail.com",
          position: "Administrateur de la mobilité futur",
          createdAt: "2025-08-06T16:07:12.792Z",
          updatedAt: "2025-08-06T16:07:12.792Z",
        },
        {
          uuid: "d412557d-6edb-4b3f-bdfd-8f784cf0aaec",
          username: "Acacie Blanchard",
          email: "violette_leroux76@hotmail.fr",
          position: "Superviseur des directives national",
          createdAt: "2025-08-06T16:07:12.796Z",
          updatedAt: "2025-08-06T16:07:12.796Z",
        },
        {
          uuid: "4b6268b1-5220-4607-9880-2835d184a92b",
          username: "Anaïs Moreau",
          email: "amante_collet23@yahoo.fr",
          position: "Stagiaire du marketing régional",
          createdAt: "2025-08-06T16:07:12.803Z",
          updatedAt: "2025-08-06T16:07:12.803Z",
        },
        {
          uuid: "1c9f2542-41ea-4b2e-af04-1541101bf8f2",
          username: "Fabien Lefevre",
          email: "anne_martin@yahoo.fr",
          position: "Administrateur des marchés principal",
          createdAt: "2025-08-06T16:07:12.811Z",
          updatedAt: "2025-08-06T16:07:12.811Z",
        },
        {
          uuid: "d9d0fe32-9069-406c-a0eb-1e4bf34231ec",
          username: "Christophe Mathieu",
          email: "amandine48@gmail.com",
          position: "Manager de l'identité central",
          createdAt: "2025-08-06T16:07:12.814Z",
          updatedAt: "2025-08-06T16:07:12.814Z",
        },
        {
          uuid: "28394365-05f3-45fd-9e65-953348a7ded3",
          username: "Odette Meyer",
          email: "marianne_carre65@hotmail.fr",
          position: "Stagiaire du web principal",
          createdAt: "2025-08-06T16:07:12.819Z",
          updatedAt: "2025-08-06T16:07:12.819Z",
        },
        {
          uuid: "70566565-22f1-41a8-8883-86ec0ce7aec8",
          username: "Adel Dumont",
          email: "esther3@yahoo.fr",
          position: "Architecte de marque national",
          createdAt: "2025-08-06T16:07:12.822Z",
          updatedAt: "2025-08-06T16:07:12.822Z",
        },
        {
          uuid: "3f4f3651-7ff5-4d41-bc4e-14de9b62de3d",
          username: "Maurice Dumas",
          email: "colin.moulin43@hotmail.fr",
          position: "Agent des applications national",
          createdAt: "2025-08-06T16:07:12.825Z",
          updatedAt: "2025-08-06T16:07:12.825Z",
        },
        {
          uuid: "18d2c077-a8c4-42c3-a3f8-e3094313a5c0",
          username: "Bénédicte Dumont",
          email: "venance93@hotmail.fr",
          position: "Manager de marque humain",
          createdAt: "2025-08-06T16:07:12.828Z",
          updatedAt: "2025-08-06T16:07:12.828Z",
        },
        {
          uuid: "be5ee083-54d4-4e11-8449-bbcffd9370af",
          username: "Dr Antonine Martinez",
          email: "aurelle87@gmail.com",
          position: "Stagiaire de la marque mondial",
          createdAt: "2025-08-06T16:07:12.830Z",
          updatedAt: "2025-08-06T16:07:12.830Z",
        },
        {
          uuid: "65e70f31-faca-4f55-b1eb-17fc775f61d6",
          username: "Prof Michel Boyer",
          email: "adrien_poirier25@gmail.com",
          position: "Architecte des infrastructures mondial",
          createdAt: "2025-08-06T16:07:12.833Z",
          updatedAt: "2025-08-06T16:07:12.833Z",
        },
        {
          uuid: "13cf119c-883a-4d98-aa5d-c8d5a0566e5b",
          username: "Prof Francisque Fleury",
          email: "simon.dupont46@yahoo.fr",
          position: "Superviseur des marchés régional",
          createdAt: "2025-08-06T16:07:12.837Z",
          updatedAt: "2025-08-06T16:07:12.837Z",
        },
      ],
    },
  ],
};

const MOCK_USERS_RESPONSE = [
  {
    uuid: "d412557d-6edb-4b3f-bdfd-8f784cf0aaec",
    username: "Acacie Blanchard",
  },
  { uuid: "873d1604-ecf0-4802-ad5c-5bd98fbf8aa7", username: "Antide Faure" },
  { uuid: "85b0bcf8-9642-4ce0-97b5-6a8b2ae6fab2", username: "Lucas Fabre" },
  { uuid: "8b91792c-6a11-4a4e-ab92-053c4c3c4ab6", username: "Adélie Berger" },
];

const MOCK_STATUS_RESPONSE = [
  {
    id: 55,
    name: "thinking",
    createdAt: "2025-08-06T16:07:12.845Z",
    updatedAt: "2025-08-06T16:07:12.845Z",
  },
  {
    id: 56,
    name: "ready",
    createdAt: "2025-08-06T16:07:12.845Z",
    updatedAt: "2025-08-06T16:07:12.845Z",
  },
  {
    id: 57,
    name: "in_progress",
    createdAt: "2025-08-06T16:07:12.845Z",
    updatedAt: "2025-08-06T16:07:12.845Z",
  },
  {
    id: 58,
    name: "done",
    createdAt: "2025-08-06T16:07:12.845Z",
    updatedAt: "2025-08-06T16:07:12.845Z",
  },
  {
    id: 59,
    name: "canceled",
    createdAt: "2025-08-06T16:07:12.845Z",
    updatedAt: "2025-08-06T16:07:12.845Z",
  },
];

vi.mock("../../api/projects", () => ({
  fetchProjectDetail: vi.fn(),
}));

vi.mock("../../api/teams", () => ({
  fetchTeams: vi.fn(),
}));

vi.mock("../../api/users", () => ({
  fetchUsersByProject: vi.fn(),
}));

vi.mock("../../api/status", () => ({
  fetchEpicStatus: vi.fn(),
}));

describe("Project Detail Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  afterEach(() => {
    cleanup();
  });

  it("should render project details", async () => {
    // Données de test pour un projet

    // On configure l'API pour retourner notre projet fictif
    fetchProjectDetail.mockResolvedValue(MOCK_PROJECT_RESPONSE);

    render(
      <BrowserRouter>
        <ProjectDetail />
      </BrowserRouter>
    );

    await screen.findByText(MOCK_PROJECT_RESPONSE.project.name);
    const description = await screen.findByTestId("description");
    expect(description.innerHTML).toBe(
      MOCK_PROJECT_RESPONSE.project.description
    );
    expect(await screen.findByRole("creator")).toHaveTextContent(
      MOCK_PROJECT_RESPONSE.project.creator.username
    );
    const status = await screen.findByTestId("status");
    expect(status).toHaveTextContent("Actif");
  });

  it("should render project statistics", async () => {
    // Données de test pour un projet

    // On configure l'API pour retourner notre projet fictif
    fetchProjectDetail.mockResolvedValue(MOCK_PROJECT_RESPONSE);

    render(
      <BrowserRouter>
        <ProjectDetail />
      </BrowserRouter>
    );

    const totalEpics = await screen.findByTestId("epic-count");
    expect(totalEpics).toHaveTextContent(
      MOCK_PROJECT_RESPONSE.project.epics.length.toString()
    );
    const totalTickets = await screen.findByTestId("ticket-count");
    expect(totalTickets).toHaveTextContent(
      MOCK_PROJECT_RESPONSE.project.epics.reduce(
        (acc, epic) => acc + (epic.tickets?.length || 0),
        0
      ) || 0
    );
    const totalComments = await screen.findByTestId("comment-count");
    expect(totalComments).toHaveTextContent(
      MOCK_PROJECT_RESPONSE.project.epics
        .reduce((acc, epic) => acc + (epic.comments?.length || 0), 0)
        .toString()
    );
    const totalTeams = await screen.findByTestId("team-count");
    expect(totalTeams).toHaveTextContent(
      MOCK_PROJECT_RESPONSE.project.teams.length.toString()
    );
  });

  it("should render project teams", async () => {
    // Données de test pour un projet

    // On configure l'API pour retourner notre projet fictif
    fetchProjectDetail.mockResolvedValue(MOCK_PROJECT_RESPONSE);

    render(
      <BrowserRouter>
        <ProjectDetail />
      </BrowserRouter>
    );

    const teams = await screen.findAllByTestId("team");
    expect(teams.length).toBe(MOCK_PROJECT_RESPONSE.project.teams.length);
    MOCK_PROJECT_RESPONSE.project.teams.forEach((team) => {
      expect(screen.getByText(team.name)).toBeInTheDocument();
    });
  });

  it("should render project EPIC list", async () => {
    // Données de test pour un projet

    // On configure l'API pour retourner notre projet fictif
    fetchProjectDetail.mockResolvedValue(MOCK_PROJECT_RESPONSE);

    render(
      <BrowserRouter>
        <ProjectDetail />
      </BrowserRouter>
    );

    const epics = await screen.findAllByTestId("epic-item");
    expect(epics.length).toBe(MOCK_PROJECT_RESPONSE.project.epics.length);
    MOCK_PROJECT_RESPONSE.project.epics.forEach((epic) => {
      expect(screen.getByText(epic.title)).toBeInTheDocument();
    });
  });

  it("should show project edit form", async () => {
    // Données de test pour un projet

    // On configure l'API pour retourner notre projet fictif
    fetchProjectDetail.mockResolvedValue(MOCK_PROJECT_RESPONSE);

    fetchTeams.mockResolvedValue(MOCK_TEAMS_RESPONSE.teams);

    render(
      <BrowserRouter>
        <ProjectDetail />
      </BrowserRouter>
    );

    const btn = await screen.findByText("Modifier le projet");
    fireEvent.click(btn);
    await screen.findByTestId("project-form");
  });

  it("should show EPIC edit form", async () => {
    // Données de test pour un projet

    // On configure l'API pour retourner notre projet fictif
    fetchProjectDetail.mockResolvedValue(MOCK_PROJECT_RESPONSE);

    fetchUsersByProject.mockResolvedValue(MOCK_USERS_RESPONSE);

    fetchEpicStatus.mockResolvedValue(MOCK_STATUS_RESPONSE);

    render(
      <BrowserRouter>
        <ProjectDetail />
      </BrowserRouter>
    );

    const btn = await screen.findByText("Nouvelle EPIC");
    fireEvent.click(btn);
    await screen.findByTestId("epic-form");
  });

  it("should show project is not found", async () => {
    // Données de test pour un projet

    // On configure l'API pour retourner notre projet fictif
    fetchProjectDetail.mockRejectedValueOnce(new Error("Not Found"));

    render(
      <BrowserRouter>
        <ProjectDetail />
      </BrowserRouter>
    );

    await screen.findByText("Projet introuvable");
  });
});
