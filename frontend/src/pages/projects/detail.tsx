import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getApi } from "../../utils/api";
import type { Project } from "../../types/project";

interface DetailProject {
  project?: Project;
}

function ProjectDetail() {
  const [project, setProject] = useState<Project>();

  const { slug } = useParams();
  async function fetchProject() {
    const result: DetailProject = await getApi()
      .get(`/projects/${slug}`)
      .json();
    setProject(result.project);
  }

  useEffect(() => {
    fetchProject();
  }, [slug]);

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col shadow-2xl p-5 rounded-lg gap-[1rem] mt-9 w-[90%] h-[35rem]">
        <h1 className="text-3xl font-bold mb-12 mt-5">Détail du projet</h1>
        {project ? (
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-2xl">Nom du projet</span>
              <span className="text-lg font-semibold text-emerald-500 mb-4">
                {project.name}
              </span>
            </div>
            {project.description && (
              <div className="flex flex-col">
                <span className="text-2xl">Description</span>
                <span className="text-lg font-medium text-gray-500 mb-4">
                  {project.description}
                </span>
              </div>
            )}
            {project.status && (
              <div className="flex flex-col">
                <span className="text-2xl">Statut</span>
                <span className="text-lg font-medium text-gray-500 mb-4">
                  {project.status}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-red-500 font-semibold py-8">
            Projet inconnu
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectDetail;
