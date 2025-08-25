import { useEffect, useState, useContext } from "react";
import { getApi } from "../utils/api";
import type { Project } from "../types/Project";
import type { Team } from "../types/Team";
import type { User } from "../types/User";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";
import DOMpurify from "dompurify";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../utils/auth";

interface RecentActivityItem {
  id: number;
  title: string;
  type: "epic" | "ticket";
  project: string;
  projectSlug?: string; // Slug du projet pour les liens
  epic?: string; // Seulement pour les tickets
  priority: "high" | "medium" | "low" | "frozen";
  status?: { name: string };
  updatedAt?: string;
}

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalTeams: number;
  totalUsers: number;
  totalEpics: number;
  totalTickets: number;
  recentProjects: Project[];
  recentActivity: RecentActivityItem[];
}

function Home() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);

        // Récupérer les données en parallèle
        const [projectsRes, teamsRes, usersRes] = await Promise.all([
          getApi().get("/projects").json<{ projects: Project[] }>(),
          getApi().get("/teams").json<{ teams: Team[] }>(),
          getApi().get("/users").json<{ users: User[] }>(),
        ]);

        const projects = projectsRes.projects;
        const teams = teamsRes.teams;
        const users = usersRes.users;

        // Calculer les statistiques
        const totalEpics = projects.reduce(
          (acc, project) => acc + (project.epics?.length || 0),
          0
        );
        const totalTickets = projects.reduce(
          (acc, project) =>
            acc +
            (project.epics?.reduce(
              (epicAcc, epic) => epicAcc + (epic.tickets?.length || 0),
              0
            ) || 0),
          0
        );

        // Projets récents (les 3 derniers)
        const recentProjects = projects.slice(0, 3);

        // Activité récente (épiques et tickets assignés à l'utilisateur)
        const recentActivity: RecentActivityItem[] = [];
        if (userInfo) {
          const epicActivities = projects.flatMap((project) =>
            (project.epics ?? [])
              .filter((epic) => epic.assignedTo === userInfo.uuid)
              .map((epic) => ({
                id: epic.id,
                title: epic.title,
                type: "epic" as const,
                project: project.name,
                projectSlug: project.slug,
                priority: epic.priority,
                status: epic.status,
                updatedAt: epic.updatedAt,
              }))
          );
          const ticketActivities = projects.flatMap((project) =>
            (project.epics ?? []).flatMap((epic) =>
              (epic.tickets ?? [])
                .filter((ticket) => ticket.assignedTo === userInfo.uuid)
                .map((ticket) => ({
                  id: ticket.id,
                  title: ticket.title,
                  type: "ticket" as const,
                  project: project.name,
                  projectSlug: project.slug,
                  epic: epic.title,
                  priority: ticket.priority,
                  status: ticket.status,
                  updatedAt: ticket.updatedAt,
                }))
            )
          );
          recentActivity.push(...epicActivities, ...ticketActivities);
        }
        recentActivity.sort(
          (a, b) =>
            new Date(b.updatedAt || 0).getTime() -
            new Date(a.updatedAt || 0).getTime()
        );

        setStats({
          totalProjects: projects.length,
          activeProjects: projects.filter((p) => p.status === "active").length,
          totalTeams: teams.length,
          totalUsers: users.length,
          totalEpics,
          totalTickets,
          recentProjects,
          recentActivity: recentActivity.slice(0, 4),
        });
      } catch {
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Chargement...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="container mx-auto px-6 py-8">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tableau de bord Jirai
        </h1>
        <p className="text-gray-600">
          Vue d&apos;ensemble de vos projets et activités
        </p>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <i className="pi pi-folder text-blue-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Projets</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalProjects}
              </p>
              <p className="text-xs text-green-600">
                {stats.activeProjects} actifs
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <i className="pi pi-users text-green-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Équipes</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalTeams}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <i className="pi pi-bookmark text-purple-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">EPIC</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalEpics}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <i className="pi pi-ticket text-blue-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">TICKET</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalTickets}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Projets récents */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Projets récents
            </h2>
          </div>
          <div className="p-6">
            {stats.recentProjects.length > 0 ? (
              <div className="space-y-4">
                {stats.recentProjects.map((project) => (
                  <div
                    key={project.slug}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <NavLink
                      to={`projects/${project.slug}`}
                      className="flex items-center space-between w-full"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {project.name}
                        </h3>
                        <div
                          className="mb-3 text-sm"
                          dangerouslySetInnerHTML={{
                            __html: DOMpurify.sanitize(
                              project.description || "Aucune description"
                            ),
                          }}
                        />
                        <div className="flex items-center mt-2 space-x-4">
                          <span className="text-xs text-gray-500">
                            {project.epics?.length || 0} EPIC
                          </span>
                          <span className="text-xs text-gray-500">
                            {project.teams?.length || 0} équipes
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            project.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {project.status === "active" ? "Actif" : "Archivé"}
                        </span>
                      </div>
                    </NavLink>
                  </div>
                ))}
                <div className="text-center pt-4">
                  <a
                    href="/projects"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Voir tous les projets →
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Aucun projet trouvé
              </p>
            )}
          </div>
        </div>

        {/* Activité récente */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Mes EPIC et TICKET assignés récemment
            </h2>
          </div>
          <div className="p-6">
            {stats.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {stats.recentActivity.map((item, index) => (
                  <NavLink
                    key={`${item.type}-${item.id}-${index}`}
                    to={
                      item.type === "epic"
                        ? `/projects/${item.projectSlug}/epics/${item.id}`
                        : `/ticket/${item.id}`
                    }
                    className="block"
                  >
                    <div className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-medium ${
                              item.type === "epic"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {item.type === "epic" ? "EPIC" : "TICKET"}
                          </span>
                        </div>
                        <h4 className="font-medium text-gray-900 text-sm">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">
                          {item.project}
                          {item.epic && ` • ${item.epic}`}
                        </p>
                        <div className="flex items-center mt-2 space-x-2">
                          <StatusBadge name={item.status?.name || ""} />
                          <PriorityBadge priority={item.priority} />
                        </div>
                      </div>
                      <div className="flex items-center">
                        <i className="pi pi-chevron-right text-gray-400"></i>
                      </div>
                    </div>
                  </NavLink>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <i className="pi pi-info-circle text-4xl text-gray-300 mb-4"></i>
                <p className="text-gray-500">Aucune EPIC ou TICKET assigné</p>
                <p className="text-sm text-gray-400 mt-1">
                  Les EPIC et TICKET qui vous sont assignés apparaîtront ici
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Actions rapides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <NavLink
              to="/projects"
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <i className="pi pi-plus-circle text-blue-600 text-xl mr-3"></i>
              <div>
                <h3 className="font-medium text-gray-900">Nouveau projet</h3>
                <p className="text-sm text-gray-600">Créer un nouveau projet</p>
              </div>
            </NavLink>

            <NavLink
              to="/teams"
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <i className="pi pi-users text-green-600 text-xl mr-3"></i>
              <div>
                <h3 className="font-medium text-gray-900">Gérer les équipes</h3>
                <p className="text-sm text-gray-600">Organiser vos équipes</p>
              </div>
            </NavLink>
            <NavLink
              to="/users"
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              <i className="pi pi-user text-purple-600 text-xl mr-3"></i>
              <div>
                <h3 className="font-medium text-gray-900">Utilisateurs</h3>
                <p className="text-sm text-gray-600">Gérer les utilisateurs</p>
              </div>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
