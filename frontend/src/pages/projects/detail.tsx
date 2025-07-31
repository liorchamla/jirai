import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getApi } from "../../utils/api";
import type { Project } from "../../types/project";
import type { Epic } from "../../types/epic";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import EpicForm from "./epicForm";
import DOMpurify from "dompurify";

interface DetailProject {
  project?: Project;
}

function ProjectDetail() {
  const [project, setProject] = useState<Project>();
  const [dialog, setDialog] = useState<"add" | "update" | null>(null);
  const [selectedEpic, setSelectedEpic] = useState<Epic | null>(null);

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
      <div className="flex flex-col shadow-2xl p-5 rounded-lg gap-[1rem] mt-9 w-[90%] mb-18">
        <h1 className="text-3xl font-bold mb-12 mt-5">Détail du projet</h1>
        {project ? (
          <div className="space-y-4 mb-6">
            <div className="flex flex-col">
              <span className="text-2xl">Nom du projet</span>
              <span className="text-lg font-semibold text-emerald-500 mb-4">
                {project.name}
              </span>
            </div>
            {project.description && (
              <div className="flex flex-col">
                <span className="text-2xl">Description</span>
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMpurify.sanitize(
                      project.description || "Aucune description"
                    ),
                  }}
                />
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
            {project.teams && project.teams.length > 0 && (
              <div className="flex flex-col">
                <span className="text-2xl">Équipes</span>
                <ul className="list-disc list-inside text-lg font-medium text-gray-500 mb-4">
                  {project.teams.map((team) => (
                    <li key={team.slug}>{team.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-red-500 font-semibold py-8">
            Projet inconnu
          </div>
        )}
        <div className="flex justify-start">
          <Button
            className="w-auto"
            icon="pi pi-plus"
            label="Ajouter une EPIC au projet"
            onClick={() => setDialog("add")}
            size="small"
          />
        </div>
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
          />
        </Dialog>
        <Dialog
          header="Modifier l'EPIC"
          visible={dialog === "update"}
          style={{ width: "60vw" }}
          onHide={() => setDialog(null)}
        >
          <EpicForm
            project={project}
            epic={selectedEpic}
            onSubmit={() => {
              setDialog(null);
              fetchProject();
            }}
          />
        </Dialog>
        {project?.epics && project.epics.length > 0 && (
          <div className="card flex md:justify-content-center">
            <ul className="m-0 border border-gray-300 rounded-lg p-3 w-full">
              {project?.epics?.map((epic) => (
                <li
                  key={epic.id}
                  className={`p-2 hover:bg-gray-100 rounded-lg border border-transparent transition-all duration-200 cursor-pointer`}
                >
                  <div className="flex flex-wrap p-2 items-center gap-3">
                    <div className="flex-1 flex flex-column gap-1">
                      <span className="font-bold">EPIC : {epic.title}</span>
                    </div>
                    {epic.priority === "frozen" && (
                      <span className="p-1 text-white bg-blue-500 rounded">
                        {epic.priority}
                      </span>
                    )}
                    {epic.priority === "low" && (
                      <span className="p-1 text-white bg-green-700 rounded">
                        {epic.priority}
                      </span>
                    )}
                    {epic.priority === "medium" && (
                      <span className="p-1 text-white bg-orange-300 rounded">
                        {epic.priority}
                      </span>
                    )}
                    {epic.priority === "high" && (
                      <span className="p-1 text-white bg-red-700 rounded">
                        {epic.priority}
                      </span>
                    )}
                    <Button
                      onClick={() => {
                        setSelectedEpic(epic);
                        setDialog("update");
                      }}
                      icon="pi pi-pencil"
                      severity="success"
                      text
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectDetail;
