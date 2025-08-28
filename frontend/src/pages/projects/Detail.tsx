import { NavLink, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { DetailProject, Project } from "../../types/Project";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import ProjectForm from "./Form";
import DOMpurify from "dompurify";
import { fetchProjectDetail } from "../../api/projects";
import ProjectStatus from "./ProjectStatus";
import ProjectStatistics from "./ProjectStatistics";
import ProjectTeams from "./ProjectTeams";
import ProjectEpics from "./ProjectEpics";

function ProjectDetail() {
  const [project, setProject] = useState<Project>();
  const [dialog, setDialog] = useState<"edit-project" | null>(null);

  const { slug } = useParams();

  async function fetchProject() {
    try {
      const result: DetailProject = await fetchProjectDetail(slug || "");
      setProject(result.project);
    } catch {
      // Handle error
    }
  }

  useEffect(() => {
    fetchProject();
  }, [slug]);

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
                <h1
                  role="heading"
                  className="text-3xl font-bold text-gray-900 mb-2"
                >
                  {project.name}
                </h1>
                <div className="flex items-center gap-2">
                  <ProjectStatus status={project.status} />
                  <span role="creator" className="text-gray-600 text-sm">
                    Créé par {project.creator.username}
                  </span>
                </div>
              </div>
              <Button
                icon="pi pi-pencil"
                label="Modifier le projet"
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
                data-testid="description"
                className="text-gray-700 prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: DOMpurify.sanitize(project.description),
                }}
              />
            </div>
          )}

          {/* Statistiques */}
          <ProjectStatistics project={project} />

          {/* Équipes assignées */}
          <ProjectTeams teams={project.teams} />

          {/* Liste des EPIC */}
          <ProjectEpics
            project={project}
            onEpicAdded={() => fetchProject()}
            onEpicUpdated={() => fetchProject()}
          />
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
