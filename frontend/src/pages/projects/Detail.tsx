import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getApi } from "../../utils/api";
import type { Project } from "../../types/Project";
import type { Epic } from "../../types/Epic";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import EpicForm from "../epics/EpicForm";
import ProjectForm from "./Form";
import DOMpurify from "dompurify";
import PriorityBadge from "../../components/PriorityBadge";
import StatusBadge from "../../components/StatusBadge";

interface DetailProject {
  project?: Project;
}

function ProjectDetail() {
  const [project, setProject] = useState<Project>();
  const [dialog, setDialog] = useState<
    "add" | "update" | "edit-project" | null
  >(null);
  const [selectedEpic, setSelectedEpic] = useState<Epic | null>(null);

  const { slug } = useParams();

  const navigate = useNavigate();

  async function fetchProject() {
    const result: DetailProject = await getApi()
      .get(`/projects/${slug}`)
      .json();
    setProject(result.project);
  }

  useEffect(() => {
    fetchProject();
  }, [slug]);

  // Calculer les statistiques
  const totalEpics = project?.epics?.length || 0;
  const totalTickets =
    project?.epics?.reduce(
      (acc, epic) => acc + (epic.tickets?.length || 0),
      0
    ) || 0;
  const totalComments =
    project?.epics?.reduce(
      (acc, epic) => acc + (epic.comments?.length || 0),
      0
    ) || 0;

  return (
    <div className="container mx-auto px-6 py-8">
      {project ? (
        <>
          {/* En-tête */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <NavLink
                    to="/projects"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <i className="pi pi-arrow-left"></i> Retour aux projets
                  </NavLink>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {project.name}
                </h1>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      project.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {project.status === "active" ? "Actif" : "Archivé"}
                  </span>
                  {project.creator && (
                    <span className="text-gray-600 text-sm">
                      Créé par {project.creator.username}
                    </span>
                  )}
                </div>
              </div>
              <Button
                icon="pi pi-pencil"
                label="Modifier projet"
                onClick={() => setDialog("edit-project")}
                className="bg-green-600 hover:bg-green-700 text-white border-green-600"
              />
            </div>
          </div>

          {/* Description */}
          {project.description && (
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Description du projet
              </h2>
              <div
                className="text-gray-700 prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: DOMpurify.sanitize(project.description),
                }}
              />
            </div>
          )}

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 mr-4">
                  <i className="pi pi-bookmark text-purple-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">EPIC</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalEpics}
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
                    {totalTickets}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 mr-4">
                  <i className="pi pi-comment text-green-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Commentaires
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalComments}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-orange-100 mr-4">
                  <i className="pi pi-users text-orange-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Équipes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {project.teams?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Équipes assignées */}
          {project.teams && project.teams.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Équipes assignées
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.teams.map((team) => (
                  <span
                    key={team.slug}
                    className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium"
                  >
                    <i className="pi pi-users mr-2"></i>
                    {team.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Liste des EPIC */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  EPIC du projet
                </h2>
                <Button
                  icon="pi pi-plus"
                  label="Nouvelle EPIC"
                  onClick={() => setDialog("add")}
                  className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                  size="small"
                />
              </div>
            </div>
            <div className="p-6">
              {project.epics && project.epics.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {project.epics.map((epic) => (
                    <div
                      key={epic.id}
                      className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200 flex flex-col h-full"
                    >
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <StatusBadge name={epic.status.name} />
                              <PriorityBadge priority={epic.priority} />
                            </div>
                            <NavLink
                              to={`/projects/${project.slug}/epics/${epic.id}`}
                              className="text-lg font-semibold text-gray-900 hover:text-blue-600 hover:underline"
                            >
                              {epic.title}
                            </NavLink>
                          </div>
                          <Button
                            onClick={() => {
                              setSelectedEpic(epic);
                              setDialog("update");
                            }}
                            icon="pi pi-pencil"
                            severity="success"
                            text
                            size="small"
                            tooltip="Modifier l'épique"
                          />
                        </div>

                        {epic.description && (
                          <div
                            className="text-sm text-gray-600 mb-4 line-clamp-3"
                            dangerouslySetInnerHTML={{
                              __html: DOMpurify.sanitize(epic.description),
                            }}
                          />
                        )}

                        <div className="space-y-2 flex-grow">
                          {epic.tickets && epic.tickets.length > 0 && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">TICKET:</span>
                              <span className="font-medium">
                                {epic.tickets.length}
                              </span>
                            </div>
                          )}

                          {epic.comments && epic.comments.length > 0 && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500 flex items-center">
                                <i className="pi pi-comment mr-1"></i>
                                Commentaires:
                              </span>
                              <span className="font-medium">
                                {epic.comments.length}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="pt-4 border-t border-gray-200 mt-4">
                          <Button
                            onClick={() =>
                              navigate(
                                `/projects/${project.slug}/epics/${epic.id}`
                              )
                            }
                            icon="pi pi-arrow-right"
                            label="Voir l'EPIC"
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
                  <i className="pi pi-bookmark text-6xl text-gray-300 mb-4"></i>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucune épique trouvée
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Commencez par créer votre première épique pour ce projet
                  </p>
                  <Button
                    icon="pi pi-plus"
                    label="Créer une épique"
                    onClick={() => setDialog("add")}
                    className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                  />
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <i className="pi pi-folder text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Projet introuvable
          </h3>
          <p className="text-gray-500 mb-6">
            Le projet que vous recherchez n&apos;existe pas ou a été supprimé
          </p>
          <NavLink
            to="/projects"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="pi pi-arrow-left mr-2"></i>
            Retour aux projets
          </NavLink>
        </div>
      )}

      {/* Dialogs */}
      <Dialog
        header="Ajouter une EPIC"
        visible={dialog === "add"}
        style={{ width: "60vw" }}
        onHide={() => setDialog(null)}
      >
        <EpicForm
          project={project}
          onSubmit={() => {
            setDialog(null);
            fetchProject(); // Rafraîchir les données du projet pour afficher la nouvelle épic
          }}
          onCancel={() => setDialog(null)}
        />
      </Dialog>

      <Dialog
        header="Modifier l'EPIC"
        visible={dialog === "update"}
        style={{ width: "60vw" }}
        onHide={() => setDialog(null)}
      >
        <EpicForm
          epic={selectedEpic}
          onSubmit={() => {
            setDialog(null);
            fetchProject();
          }}
          onCancel={() => setDialog(null)}
        />
      </Dialog>

      <Dialog
        header="Modifier le projet"
        visible={dialog === "edit-project"}
        style={{ width: "60vw" }}
        onHide={() => setDialog(null)}
      >
        <ProjectForm
          project={project}
          onSubmit={() => {
            setDialog(null);
            fetchProject();
          }}
          onCancel={() => setDialog(null)}
        />
      </Dialog>
    </div>
  );
}

export default ProjectDetail;
