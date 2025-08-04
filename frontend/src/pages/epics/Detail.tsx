import { useParams } from "react-router-dom";
import type { Epic } from "../../types/Epic";
import { getApi } from "../../utils/api";
import React, { useEffect, useState } from "react";
import DOMpurify from "dompurify";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import EpicForm from "./EpicForm";
import PriorityBadge from "../../components/PriorityBadge";

function EpicDetail() {
  const [epic, setEpic] = useState<Epic | null>(null);
  const [dialog, setDialog] = useState<"update" | null>(null);

  const params = useParams();
  const { id } = params;

  const fetchEpic = React.useCallback(async () => {
    const result: Epic = await getApi().get(`/epics/${id}`).json();
    setEpic(result);
  }, [id]);

  useEffect(() => {
    fetchEpic();
  }, [fetchEpic]);

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
            <div className="flex flex-row justify-between items-center mb-6">
              <div className="flex flex-col">
                <span className="text-2xl">
                  EPIC :{" "}
                  <span className="text-gray-400 font-bold">{epic.title}</span>
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl">Priorité</span>
                <PriorityBadge priority={epic.priority} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl">Description</span>
              <div
                className="mt-4"
                dangerouslySetInnerHTML={{
                  __html: DOMpurify.sanitize(epic.description),
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
