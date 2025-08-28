import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import EpicForm from "../epics/EpicForm";
import type { Project } from "../../types/Project";
import StatusBadge from "../../components/StatusBadge";
import PriorityBadge from "../../components/PriorityBadge";
import { NavLink, useNavigate } from "react-router-dom";
import type { Epic } from "../../types/Epic";
import DOMpurify from "dompurify";

interface PropsType {
  project: Project;
  onEpicAdded?: () => void;
  onEpicUpdated?: () => void;
}

function ProjectEpics({ project, onEpicAdded, onEpicUpdated }: PropsType) {
  const [dialog, setDialog] = useState<"add" | "update" | null>(null);
  const [selectedEpic, setSelectedEpic] = useState<Epic | null>(null);

  const navigate = useNavigate();

  return (
    <>
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
                  data-testid="epic-item"
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
                          navigate(`/projects/${project.slug}/epics/${epic.id}`)
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
            onEpicAdded?.(); // Rafraîchir les données du projet pour afficher la nouvelle épic
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
            onEpicUpdated?.();
          }}
          onCancel={() => setDialog(null)}
        />
      </Dialog>
    </>
  );
}

export default ProjectEpics;
