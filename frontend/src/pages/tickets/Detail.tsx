import { getApi } from "../../utils/api";
import React, { useEffect, useState } from "react";
import DOMpurify from "dompurify";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import PriorityBadge from "../../components/PriorityBadge";
import TicketForm from "../tickets/TicketForm";
import type { Ticket } from "../../types/Ticket";
import { useParams } from "react-router-dom";
import StatusBadge from "../../components/StatusBadge";
import CommentForm from "../comments/CommentForm";

function TicketDetail() {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [dialog, setDialog] = useState<"update" | null>(null);

  const { id } = useParams();

  const fetchTicket = React.useCallback(async () => {
    const result: Ticket = await getApi().get(`/tickets/${id}`).json();
    setTicket(result);
  }, [id]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

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
            {ticket.comments && ticket.comments.length > 0 && (
              <div className="flex flex-col gap-5">
                {ticket.comments.map((comment) => (
                  <article key={ticket.id}>
                    <header className="font-bold">
                      {comment.creator.username},{" "}
                      <span className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleString("fr-FR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </header>

                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMpurify.sanitize(comment.content),
                      }}
                    />
                  </article>
                ))}
              </div>
            )}

            <CommentForm
              ticket={ticket}
              onSubmit={() => {
                fetchTicket(); // Rafraîchir les données du ticket pour afficher le nouveau commentaire
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default TicketDetail;
