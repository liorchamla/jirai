import { getApi } from "../../utils/api";
import React, { useContext, useEffect, useRef, useState } from "react";
import DOMpurify from "dompurify";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import PriorityBadge from "../../components/PriorityBadge";
import TicketForm from "../tickets/TicketForm";
import type { Ticket } from "../../types/Ticket";
import { useParams } from "react-router-dom";
import StatusBadge from "../../components/StatusBadge";
import CommentForm from "../comments/CommentForm";
import { AuthContext } from "../../utils/auth";
import type { Comment } from "../../types/Comment";
import { Toast } from "primereact/toast";

function TicketDetail() {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [dialog, setDialog] = useState<"update" | "deleteComment" | null>(null);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [commentDialog, setCommentDialog] = useState<
    "update" | "delete" | null
  >(null);

  const { id } = useParams();

  const { userInfo } = useContext(AuthContext);

  const toast = useRef<Toast>(null);

  const fetchTicket = React.useCallback(async () => {
    const result: Ticket = await getApi().get(`/tickets/${id}`).json();
    setTicket(result);
  }, [id]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  const handleConfirmDelete = async (comment: Comment) => {
    try {
      await getApi().delete(`/comments/${comment.id}`).res();
      setDialog(null);
      fetchTicket(); // Rafraîchir la liste
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Commentaire supprimé avec succès",
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
                  <article key={comment.id}>
                    <header className="font-bold flex items-center">
                      <span className="align-top">
                        {comment.creator.username},{" "}
                        <span className="text-sm text-gray-500 mr-1">
                          {new Date(comment.createdAt).toLocaleString("fr-FR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </span>
                      {comment.creator.uuid === userInfo?.uuid && (
                        <>
                          <Button
                            icon="pi pi-pencil"
                            className="ml-2 p-button-text p-0 h-auto"
                            severity="success"
                            size="small"
                            onClick={() => {
                              setSelectedComment(comment);
                              setCommentDialog("update");
                            }}
                          />
                          <Button
                            icon="pi pi-trash"
                            className="ml-1 p-button-text p-0 h-auto"
                            severity="danger"
                            size="small"
                            onClick={() => {
                              setSelectedComment(comment);
                              setDialog("deleteComment");
                            }}
                          />
                        </>
                      )}
                    </header>
                    {commentDialog === "update" &&
                    selectedComment?.id === comment.id ? (
                      <CommentForm
                        comment={selectedComment}
                        onSubmit={() => {
                          setCommentDialog(null);
                          fetchTicket(); // Rafraîchir les données du ticket pour afficher le commentaire
                        }}
                      />
                    ) : (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: DOMpurify.sanitize(comment.content),
                        }}
                      />
                    )}
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
      <Dialog
        header="Supprimer commentaire"
        visible={dialog === "deleteComment"}
        style={{ width: "30vw" }}
        onHide={() => {
          setDialog(null);
        }}
      >
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4">
            Êtes-vous sûr de vouloir supprimer ce commentaire?
          </h2>
          <div className="flex gap-2">
            <Button
              label="Confirmer"
              severity="danger"
              onClick={() => {
                if (selectedComment) {
                  handleConfirmDelete(selectedComment);
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
      <Toast ref={toast} position="top-right" />
    </div>
  );
}

export default TicketDetail;
