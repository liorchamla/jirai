import { Button } from "primereact/button";
import { Link, useNavigate } from "react-router-dom";
import type { Project } from "../../types/Project";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../utils/auth";
import DOMpurify from "dompurify";
import { Dialog } from "primereact/dialog";
import ProjectForm from "./Form";
import { Toast } from "primereact/toast";
import { getApi } from "../../utils/api";

interface ProjectCardProps {
  project: Project;
  onProjectUpdated: () => void;
  onProjectDeleted: () => void;
}

export default function ProjectCard({
  project,
  onProjectUpdated,
  onProjectDeleted,
}: ProjectCardProps) {
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(
    undefined
  );
  const [dialog, setDialog] = useState<"add" | "update" | "delete" | null>(
    null
  );
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const toast = useRef<Toast>(null);

  const handleDelete = (project: Project) => {
    setSelectedProject(project);
    setDialog("delete");
  };

  const handleConfirmDelete = async (project: Project) => {
    try {
      await getApi().delete(`/projects/${project.slug}`).res();
      setDialog(null);
      onProjectDeleted(); // Rafraîchir la liste
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

  return (
    <>
      <div
        data-testid="project-card"
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
              <span className="font-medium">{project.epics?.length || 0}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Créateur:</span>
              <span className="font-medium">{project.creator.username}</span>
            </div>

            {project.teams && project.teams.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">
                  {project.teams.length === 1 ? "Équipe:" : "Équipes:"}
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
            onProjectUpdated();
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
    </>
  );
}
