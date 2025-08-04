import { useParams } from "react-router-dom";
import type { Epic } from "../../types/epic";
import { getApi } from "../../utils/api";
import { useEffect, useState } from "react";
import DOMpurify from "dompurify";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import EpicForm from "./epicForm";

function EpicDetail() {
  const [epic, setEpic] = useState<Epic | null>(null);
  const [dialog, setDialog] = useState<"update" | null>(null);

  // Déplacer useParams au niveau du composant
  const params = useParams();
  const { id } = params;

  async function fetchEpic() {
    const result: Epic = await getApi().get(`/epics/${id}`).json();
    setEpic(result);
  }

  useEffect(() => {
    fetchEpic();
  }, [id]); // Relancer quand l'ID change

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col shadow-2xl p-5 rounded-lg gap-[1rem] mt-9 w-[90%] mb-18">
        {epic && (
          <>
            <Button
              className="w-fit"
              icon="pi pi-plus"
              label="Modifier EPIC"
              onClick={() => setDialog("update")}
              size="small"
            />
            <Dialog
              header="Modifier l'EPIC"
              visible={dialog === "update"}
              style={{ width: "60vw" }}
              onHide={() => setDialog(null)}
            >
              <EpicForm
                epic={epic}
                onSubmit={() => {
                  setDialog(null);
                  fetchEpic();
                }}
              />
            </Dialog>
            <div className="flex flex-row justify-between items-start mb-6">
              <div className="flex flex-col">
                <span className="text-2xl">EPIC</span>
                <span className="text-lg font-semibold text-emerald-500">
                  {epic.title}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl">Priorité</span>
                {epic.priority === "frozen" && (
                  <span className="p-1 text-white bg-blue-500 rounded w-fit">
                    {epic.priority}
                  </span>
                )}
                {epic.priority === "low" && (
                  <span className="p-1 text-white bg-green-700 rounded w-fit">
                    {epic.priority}
                  </span>
                )}
                {epic.priority === "medium" && (
                  <span className="p-1 text-white bg-orange-300 rounded w-fit">
                    {epic.priority}
                  </span>
                )}
                {epic.priority === "high" && (
                  <span className="p-1 text-white bg-red-700 rounded w-fit">
                    {epic.priority}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl">Description</span>
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMpurify.sanitize(
                    epic.description || "Aucune description"
                  ),
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default EpicDetail;
