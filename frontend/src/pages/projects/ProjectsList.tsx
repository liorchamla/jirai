import { Button } from "primereact/button";
import { Link, useNavigate } from "react-router-dom";
import { getApi } from "../../utils/api";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import type { Project } from "../../types/Project";
import { Dialog } from "primereact/dialog";
import ProjectForm from "./Form";
import { Toast } from "primereact/toast";
import { AuthContext } from "../../utils/auth";
import DOMpurify from "dompurify";

function ProjectsList() {
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(
    undefined
  );
  const [projects, setProjects] = useState<Project[]>([]);
  const [dialog, setDialog] = useState<"add" | "update" | "delete" | null>(
    null
  );

  const { userInfo } = useContext(AuthContext);

  const toast = useRef<Toast>(null);

  const navigate = useNavigate();

  const fetchProjects = useCallback(async () => {
    const result: { projects: Project[] } = await getApi()
      .get("/projects")
      .json();
    setProjects(result.projects);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = (project: Project) => {
    setSelectedProject(project);
    setDialog("delete");
  };

  const handleConfirmDelete = async (project: Project) => {
    try {
      await getApi().delete(`/projects/${project.slug}`).res();
      setDialog(null);
      fetchProjects(); // Rafraîchir la liste
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Projet supprimé avec succès",
        life: 3000,
      });
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Une erreur s'est produite lors de la suppression du projet",
      });
    }
  };

  // Calculer les statistiques
  const activeProjects = projects.filter((p) => p.status === "active").length;
  const totalEpics = projects.reduce(
    (acc, project) => acc + (project.epics?.length || 0),
    0
  );
  const totalTeams = projects.reduce(
    (acc, project) => acc + (project.teams?.length || 0),
    0
  );

  return (
    <div className="container mx-auto px-6 py-8">
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Gestion des projets
            </h1>
            <p className="text-gray-600">Gérez et organisez tous vos projets</p>
          </div>
          <Button
            icon="pi pi-plus"
            label="Nouveau projet"
            onClick={() => setDialog("add")}
            className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
          />
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <i className="pi pi-folder text-blue-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total projets</p>
              <p className="text-2xl font-bold text-gray-900">
                {projects.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <i className="pi pi-check-circle text-green-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Projets actifs
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {activeProjects}
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
              <p className="text-sm font-medium text-gray-600">Total EPIC</p>
              <p className="text-2xl font-bold text-gray-900">{totalEpics}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 mr-4">
              <i className="pi pi-users text-orange-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Équipes liées</p>
              <p className="text-2xl font-bold text-gray-900">{totalTeams}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des projets */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Tous les projets
          </h2>
        </div>
        <div className="p-6">
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.slug}
                  className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200 flex flex-col h-full"
                >
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <Link
                          to={`/projects/${project.slug}`}
                          className="text-lg font-semibold text-gray-900 hover:text-blue-600 hover:underline"
                        >
                          {project.name}
                        </Link>
                        <div className="mt-2">
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
                      </div>
                      {project.creator.uuid === userInfo?.uuid && (
                        <div className="flex space-x-1">
                          <Button
                            onClick={() => {
                              setSelectedProject(project);
                              setDialog("update");
                            }}
                            icon="pi pi-pencil"
                            severity="success"
                            text
                            size="small"
                            tooltip="Modifier"
                          />
                          <Button
                            icon="pi pi-times"
                            severity="danger"
                            onClick={() => handleDelete(project)}
                            text
                            size="small"
                            tooltip="Supprimer"
                          />
                        </div>
                      )}
                    </div>

                    <div
                      className="text-sm text-gray-600 mb-4 line-clamp-3"
                      dangerouslySetInnerHTML={{
                        __html: DOMpurify.sanitize(
                          project.description || "Aucune description"
                        ),
                      }}
                    />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">EPIC:</span>
                        <span className="font-medium">
                          {project.epics?.length || 0}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Créateur:</span>
                        <span className="font-medium">
                          {project.creator.username}
                        </span>
                      </div>

                      {project.teams && project.teams.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-500 mb-2">
                            {project.teams.length === 1
                              ? "Équipe:"
                              : "Équipes:"}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {project.teams.map((team) => (
                              <span
                                key={team.slug}
                                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                              >
                                {team.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-gray-200 mt-auto">
                      <Button
                        onClick={() => navigate(`/projects/${project.slug}`)}
                        icon="pi pi-arrow-right"
                        label="Voir le projet"
                        text
                        className="w-full justify-center"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <i className="pi pi-folder text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun projet trouvé
              </h3>
              <p className="text-gray-500 mb-6">
                Commencez par créer votre premier projet
              </p>
              <Button
                icon="pi pi-plus"
                label="Créer un projet"
                onClick={() => setDialog("add")}
                className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
              />
            </div>
          )}
        </div>
      </div>

      {/* Actions rapides */}
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Actions rapides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setDialog("add")}
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <i className="pi pi-plus-circle text-blue-600 text-xl mr-3"></i>
              <div className="text-left">
                <h3 className="font-medium text-gray-900">Nouveau projet</h3>
                <p className="text-sm text-gray-600">Créer un nouveau projet</p>
              </div>
            </button>

            <Link
              to="/teams"
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <i className="pi pi-users text-green-600 text-xl mr-3"></i>
              <div className="text-left">
                <h3 className="font-medium text-gray-900">Gérer les équipes</h3>
                <p className="text-sm text-gray-600">Organiser vos équipes</p>
              </div>
            </Link>

            <Link
              to="/users"
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              <i className="pi pi-user text-purple-600 text-xl mr-3"></i>
              <div className="text-left">
                <h3 className="font-medium text-gray-900">Utilisateurs</h3>
                <p className="text-sm text-gray-600">Gérer les utilisateurs</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <Dialog
        header="Ajouter un projet"
        visible={dialog === "add"}
        style={{ width: "60vw" }}
        onHide={() => setDialog(null)}
      >
        <ProjectForm
          onSubmit={() => {
            setDialog(null);
            fetchProjects();
          }}
          onCancel={() => setDialog(null)}
        />
      </Dialog>

      <Dialog
        header="Modifier le projet"
        visible={dialog === "update"}
        style={{ width: "60vw" }}
        onHide={() => setDialog(null)}
      >
        <ProjectForm
          project={selectedProject}
          onSubmit={() => {
            setDialog(null);
            fetchProjects();
          }}
          onCancel={() => setDialog(null)}
        />
      </Dialog>

      <Dialog
        header="Supprimer projet"
        visible={dialog === "delete"}
        style={{ width: "30vw" }}
        onHide={() => setDialog(null)}
      >
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4 text-center">
            Êtes-vous sûr de vouloir supprimer le projet &quot;
            {selectedProject?.name}&quot; ?
          </h2>
          <div className="flex gap-2">
            <Button
              label="Confirmer"
              severity="danger"
              onClick={() => {
                if (selectedProject) {
                  handleConfirmDelete(selectedProject);
                }
              }}
            />
            <Button label="Annuler" onClick={() => setDialog(null)} />
          </div>
        </div>
      </Dialog>

      <Toast ref={toast} position="top-right" />
    </div>
  );
}
export default ProjectsList;
