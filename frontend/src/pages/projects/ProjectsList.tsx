import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "../../types/Project";
import { Dialog } from "primereact/dialog";
import ProjectForm from "./Form";
import { Toast } from "primereact/toast";
import { fetchProjects as apiFetchProjects } from "../../api/projects";
import ProjectCard from "./ProjectCard";
import ProjectListStatistics from "./ProjectListStatistics";

function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [dialog, setDialog] = useState<"add" | "update" | "delete" | null>(
    null
  );

  const toast = useRef<Toast>(null);

  const fetchProjects = useCallback(async () => {
    const result = await apiFetchProjects();
    setProjects(result.projects);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Calculer les statistiques

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
      <ProjectListStatistics projects={projects} />

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
                <ProjectCard
                  key={project.slug}
                  project={project}
                  onProjectUpdated={fetchProjects}
                  onProjectDeleted={fetchProjects}
                />
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

      <Toast ref={toast} position="top-right" />
    </div>
  );
}
export default ProjectsList;
