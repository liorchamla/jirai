import { getApi } from "../../utils/api";
import React, { useEffect, useRef, useState } from "react";
import DOMpurify from "dompurify";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import PriorityBadge from "../../components/PriorityBadge";
import TicketForm from "../tickets/TicketForm";
import type { Ticket } from "../../types/Ticket";
import { useParams } from "react-router-dom";
import StatusBadge from "../../components/StatusBadge";
import CommentForm from "../comments/commentForm";
import { Panel } from "primereact/panel";

function TicketDetail() {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [dialog, setDialog] = useState<"update" | null>(null);
  const [commentDialog, setCommentDialog] = useState<"add" | null>(null);

  const { id } = useParams();

  const fetchTicket = React.useCallback(async () => {
    const result: Ticket = await getApi().get(`/tickets/${id}`).json();
    setTicket(result);
  }, [id]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  const ref = useRef<Panel | null>(null);

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col shadow-2xl p-5 rounded-lg gap-[1rem] mt-9 w-[90%] mb-18">
        {ticket && (
          <>
            <Button
              className="w-fit"
              icon="pi pi-pencil"
              label="Modifier TICKET"
              onClick={() => setDialog("update")}
              size="small"
            />
            <Dialog
              header="Modifier le TICKET"
              visible={dialog === "update"}
              style={{ width: "60vw" }}
              onHide={() => setDialog(null)}
            >
              <TicketForm
                ticket={ticket}
                onSubmit={() => {
                  setDialog(null);
                  fetchTicket();
                }}
              />
            </Dialog>
            <div className="flex flex-row justify-between items-center mb-6">
              <div className="flex flex-col">
                <span className="text-2xl">
                  TICKET :{" "}
                  <span className="text-gray-400 font-bold">
                    {ticket.title}
                  </span>
                </span>
                <div className="mt-2">
                  <StatusBadge name={ticket.status.name} />
                  <span className="p-1 text-white rounded w-fit bg-gray-300">
                    {ticket.status.name}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl">Priorité</span>
                <PriorityBadge priority={ticket.priority} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl">Description</span>
              <div
                className="mt-2 mb-7"
                dangerouslySetInnerHTML={{
                  __html: DOMpurify.sanitize(ticket.description),
                }}
              />
            </div>
            <span className="text-2xl mt-3">Commentaires</span>
            <div className="flex justify-start">
              <Button
                className="w-auto"
                icon="pi pi-plus"
                label="Ajouter un commentaire au TICKET"
                onClick={() => setCommentDialog("add")}
                size="small"
              />
              <Dialog
                header="Ajouter un commentaire"
                visible={commentDialog === "add"}
                style={{ width: "60vw" }}
                onHide={() => setCommentDialog(null)}
              >
                {ticket && (
                  <CommentForm
                    ticket={ticket}
                    onSubmit={() => {
                      setCommentDialog(null);
                      fetchTicket(); // Rafraîchir les données du TICKET pour afficher le nouveau commentaire
                    }}
                  />
                )}
              </Dialog>
            </div>
            {ticket?.comments && ticket.comments.length > 0 && (
              <div className="card flex md:justify-content-center">
                <ul className="m-0 border border-gray-300 p-3 w-full">
                  {ticket.comments.map((comment) => (
                    <Panel
                      key={comment.id}
                      ref={ref}
                      className="mb-2"
                      header={
                        comment.creator?.username || "Utilisateur inconnu"
                      }
                      footer={
                        <div className="flex justify-end">
                          <span className="text-sm text-gray-500 px-2 py-1">
                            {new Date(comment.createdAt).toLocaleString(
                              "fr-FR",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                      }
                      toggleable
                    >
                      <div
                        className="m-0"
                        dangerouslySetInnerHTML={{
                          __html: DOMpurify.sanitize(comment.content),
                        }}
                      ></div>
                    </Panel>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default TicketDetail;
