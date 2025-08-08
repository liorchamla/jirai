import { NavLink, useParams } from "react-router-dom";
import type { Epic } from "../../types/Epic";
import { getApi } from "../../utils/api";
import React, { useContext, useEffect, useRef, useState } from "react";
import DOMpurify from "dompurify";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import EpicForm from "./EpicForm";
import PriorityBadge from "../../components/PriorityBadge";
import TicketForm from "../tickets/TicketForm";
import type { Ticket } from "../../types/Ticket";
import StatusBadge from "../../components/StatusBadge";
import CommentForm from "../comments/CommentForm";
import { AuthContext } from "../../utils/auth";
import type { Comment } from "../../types/Comment";
import { Toast } from "primereact/toast";

function EpicDetail() {
  const [epic, setEpic] = useState<Epic | null>(null);
  const [dialog, setDialog] = useState<"update" | "deleteComment" | null>(null);
  const [ticketDialog, setTicketDialog] = useState<"add" | "update" | null>(
    null
  );
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [commentDialog, setCommentDialog] = useState<
    "update" | "delete" | null
  >(null);
  const [commentFormKey, setCommentFormKey] = useState(0);

  const { userInfo } = useContext(AuthContext);

  const toast = useRef<Toast>(null);

  const params = useParams();
  const { id } = params;

  const fetchEpic = React.useCallback(async () => {
    const result: Epic = await getApi().get(`/epics/${id}`).json();
    setEpic(result);
  }, [id]);

  useEffect(() => {
    fetchEpic();
  }, [fetchEpic]);

  const handleConfirmDelete = async (comment: Comment) => {
    try {
      await getApi().delete(`/comments/${comment.id}`).res();
      setDialog(null);
      fetchEpic(); // Rafraîchir la liste
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
        {epic && (
          <>
            <Button
              className="w-fit"
              icon="pi pi-pencil"
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
                <div className="mt-2">
                  <StatusBadge name={epic.status.name} />
                  <span className="p-1 text-white rounded w-fit bg-gray-300">
                    {epic.status.name}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl">Priorité</span>
                <PriorityBadge priority={epic.priority} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl">Description</span>
              <div
                className="mt-2 mb-7"
                dangerouslySetInnerHTML={{
                  __html: DOMpurify.sanitize(epic.description),
                }}
              />
            </div>
          </>
        )}
        <div className="flex flex-col gap-4">
          <div className="flex justify-start">
            <Button
              className="w-auto"
              icon="pi pi-plus"
              label="Ajouter un TICKET à l'EPIC"
              onClick={() => setTicketDialog("add")}
              size="small"
            />
          </div>

          {epic?.tickets && epic.tickets.length > 0 && (
            <div className="card flex md:justify-content-center">
              <ul className="m-0 border border-gray-300 rounded-lg p-3 w-full">
                {epic.tickets.map((ticket) => (
                  <li
                    key={ticket.id}
                    className={`p-2 hover:bg-gray-100 rounded-lg border border-transparent transition-all duration-200 cursor-pointer`}
                  >
                    <div className="flex flex-row items-center justify-between w-full">
                      <NavLink to={`/ticket/${ticket.id}`} className="flex-1">
                        <div className="p-2">
                          {ticket.status && (
                            <StatusBadge name={ticket.status.name} />
                          )}
                          <span className="font-bold">
                            TICKET : {ticket.title}
                          </span>
                          {ticket.comments && ticket.comments.length > 0 && (
                            <>
                              <span className="pi pi-comment text-gray-500 ml-3"></span>
                              <span className="ml-0.5 text-sm font-medium text-gray-600">
                                {ticket.comments?.length}
                              </span>
                            </>
                          )}
                        </div>
                      </NavLink>
                      <div className="flex items-center gap-2">
                        <PriorityBadge priority={ticket.priority} />
                      </div>
                      <div className="flex justify-end">
                        <Button
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setTicketDialog("update");
                          }}
                          icon="pi pi-pencil"
                          severity="success"
                          text
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Dialog
            header="Ajouter un TICKET"
            visible={ticketDialog === "add"}
            style={{ width: "60vw" }}
            onHide={() => setTicketDialog(null)}
          >
            <TicketForm
              epic={epic}
              onSubmit={() => {
                setTicketDialog(null);
                fetchEpic(); // Rafraîchir les données de l'EPIC pour afficher le nouveau ticket
              }}
            />
          </Dialog>
          <Dialog
            header="Modifier le TICKET"
            visible={ticketDialog === "update"}
            style={{ width: "60vw" }}
            onHide={() => setTicketDialog(null)}
          >
            <TicketForm
              ticket={selectedTicket}
              onSubmit={() => {
                setTicketDialog(null);
                fetchEpic();
              }}
            />
          </Dialog>
        </div>

        {epic?.comments && epic.comments.length > 0 && (
          <div className="flex flex-col gap-5">
            {epic.comments.map((comment) => (
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
                      fetchEpic(); // Rafraîchir les données de l'EPIC pour afficher le commentaire
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

        {epic && (
          <CommentForm
            key={commentFormKey}
            epic={epic}
            onSubmit={() => {
              setCommentFormKey((prev) => prev + 1); // Incrémenter la clé pour vider le formulaire
              fetchEpic(); // Rafraîchir les données de l'EPIC pour afficher le nouveau commentaire
            }}
          />
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

export default EpicDetail;
