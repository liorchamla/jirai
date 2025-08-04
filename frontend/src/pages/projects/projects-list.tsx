import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Link, useNavigate } from "react-router-dom";
import { getApi } from "../../utils/api";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import type { Project } from "../../types/project";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import ProjectForm from "./form";
import { Toast } from "primereact/toast";
import { AuthContext } from "../../utils/auth";

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

  const statusProjectTemplate = (project: Project) => {
    return <Tag value={project.status} severity={getSeverity(project)}></Tag>;
  };

  const getSeverity = (project: Project) => {
    switch (project.status) {
      case "active":
        return "success";

      case "archived":
        return "warning";

      default:
        return null;
    }
  };

  const getProjectActions = (project: Project) => {
    return (
      <>
        <Button
          onClick={() => navigate(`/projects/${project.slug}`)}
          icon="pi pi-eye"
          severity="info"
          text
        />
        {project.creator.uuid === userInfo?.uuid && (
          <>
            <Button
              onClick={() => {
                setSelectedProject(project);
                setDialog("update");
              }}
              icon="pi pi-pencil"
              severity="success"
              text
            />
            <Button
              icon="pi pi-times"
              severity="danger"
              onClick={() => {
                handleDelete(project);
              }}
              className="ml-2"
              text
            />
          </>
        )}
      </>
    );
  };

  const getProjectTeams = (project: Project) => {
    if (!project.teams || project.teams.length === 0) {
      return <span className="text-gray-500">Aucune équipe</span>;
    }

    return (
      <div className="flex flex-wrap gap-1">
        {project.teams.map((team) => (
          <span
            key={team.slug}
            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
          >
            {team.name}
          </span>
        ))}
      </div>
    );
  };

  const getProjectName = (project: Project) => {
    return (
      <Link
        to={`/projects/${project.slug}`}
        className="hover:text-blue-800 hover:underline font-medium"
      >
        {project.name}
      </Link>
    );
  };

  return (
    <div className="flex flex-col gap-5 py-5 px-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Liste des projets</h1>
        <Button
          icon="pi pi-plus"
          label="Ajouter un projet"
          onClick={() => setDialog("add")}
          size="small"
        />
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
          />
        </Dialog>
        <Dialog
          header="Supprimer projet"
          visible={dialog === "delete"}
          style={{ width: "30vw" }}
          onHide={() => {
            setDialog(null);
          }}
        >
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-4">
              Êtes-vous sûr de vouloir supprimer ce projet &quot;
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
              <Button
                label="Annuler"
                className="mt-2"
                onClick={() => setDialog(null)}
              />
            </div>
          </div>
        </Dialog>
      </div>
      <DataTable value={projects}>
        <Column body={getProjectName} header="Project" />
        <Column body={statusProjectTemplate} header="Status" />
        <Column body={getProjectTeams} header="Teams" />
        <Column body={getProjectActions} header="Actions" />
      </DataTable>
      <Link to="/login" className="btn btn-primary">
        Go to Login
      </Link>
      <Toast ref={toast} position="top-right" />
    </div>
  );
}
export default ProjectsList;
