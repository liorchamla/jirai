import { getApi } from "../../utils/api";
import React, { useContext, useEffect, useRef, useState } from "react";
import DOMpurify from "dompurify";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import PriorityBadge from "../../components/PriorityBadge";
import TicketForm from "../tickets/TicketForm";
import type { Ticket } from "../../types/Ticket";
import { NavLink, useParams } from "react-router-dom";
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
  const [loadingSummary, setLoadingSummary] = useState<boolean>(false);
  const [commentsSummary, setCommentsSummary] = useState<string | null>(null);

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

  const fetchCommentsSummary = async () => {
    try {
      setLoadingSummary(true);
      const response: { summary: string } = await getApi()
        .get(`/ticket/${id}/summary`)
        .json();
      setCommentsSummary(response.summary.split("\n").join("<br />"));
      setLoadingSummary(false);
    } catch (error) {
      setLoadingSummary(false);
      // eslint-disable-next-line
      console.error("Error fetching comments summary:", error);

      // Afficher plus de détails sur l'erreur
      let errorMessage = "Impossible de récupérer le résumé des commentaires.";
      if (error && typeof error === "object" && "message" in error) {
        errorMessage += ` Détail: ${error.message}`;
      }

      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: errorMessage,
      });
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {ticket ? (
        <>
          {/* En-tête avec navigation */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <NavLink
                    to="/projects"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <i className="pi pi-arrow-left"></i> Retour aux projets
                  </NavLink>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {ticket.title}
                </h1>
                <div className="flex items-center gap-2 mb-3">
                  <StatusBadge name={ticket.status.name} />
                  <PriorityBadge priority={ticket.priority} />
                </div>
                {/* Informations créateur et assignation */}
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <i className="pi pi-user"></i>
                    <span>
                      Créé par <strong>{ticket.creator.username}</strong>
                    </span>
                  </div>
                  {ticket.assignee ? (
                    <div className="flex items-center gap-2">
                      <i className="pi pi-users"></i>
                      <span>
                        Assigné à <strong>{ticket.assignee.username}</strong>
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-orange-600">
                      <i className="pi pi-exclamation-triangle"></i>
                      <span>Non assigné</span>
                    </div>
                  )}
                </div>
              </div>
              <Button
                icon="pi pi-pencil"
                label="Modifier le TICKET"
                onClick={() => setDialog("update")}
                className="bg-green-600 hover:bg-green-700 text-white border-green-600"
              />
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Description du TICKET
            </h2>
            <div
              className="text-gray-700 prose max-w-none [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-disc [&_ol]:ml-6 [&_li]:mb-1"
              dangerouslySetInnerHTML={{
                __html: DOMpurify.sanitize(ticket.description),
              }}
            />
          </div>

          {/* Résumé IA et Commentaires */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Discussion
                </h2>
                {!commentsSummary &&
                  ticket.comments &&
                  ticket.comments.length > 0 && (
                    <Button
                      icon="pi pi-sparkles"
                      label="Résumé IA"
                      loading={loadingSummary}
                      onClick={() => fetchCommentsSummary()}
                      className="bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
                      size="small"
                      outlined
                    />
                  )}
              </div>
            </div>
            <div className="p-6">
              {commentsSummary && (
                <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2 flex items-center">
                    <i className="pi pi-sparkles mr-2"></i>
                    Résumé de la conversation
                  </h3>
                  <div
                    className="text-purple-800"
                    dangerouslySetInnerHTML={{ __html: commentsSummary }}
                  />
                </div>
              )}

              {ticket.comments && ticket.comments.length > 0 ? (
                <div className="space-y-6">
                  {ticket.comments.map((comment) => (
                    <article
                      key={comment.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <header className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {comment.creator.username}
                          </span>
                          <span className="text-sm text-gray-500">
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
                        {comment.creator.uuid === userInfo?.uuid && (
                          <div className="flex items-center gap-1">
                            <Button
                              icon="pi pi-pencil"
                              severity="success"
                              text
                              size="small"
                              onClick={() => {
                                setSelectedComment(comment);
                                setCommentDialog("update");
                              }}
                              tooltip="Modifier"
                            />
                            <Button
                              icon="pi pi-trash"
                              severity="danger"
                              text
                              size="small"
                              onClick={() => {
                                setSelectedComment(comment);
                                setDialog("deleteComment");
                              }}
                              tooltip="Supprimer"
                            />
                          </div>
                        )}
                      </header>
                      {commentDialog === "update" &&
                      selectedComment?.id === comment.id ? (
                        <CommentForm
                          comment={selectedComment}
                          onSubmit={() => {
                            setCommentDialog(null);
                            fetchTicket();
                          }}
                        />
                      ) : (
                        <div
                          className="text-gray-700 prose max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: DOMpurify.sanitize(comment.content),
                          }}
                        />
                      )}
                    </article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <i className="pi pi-comment text-4xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500">
                    Aucun commentaire pour le moment
                  </p>
                </div>
              )}

              {/* Formulaire d'ajout de commentaire */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <CommentForm
                  ticket={ticket}
                  onSubmit={() => {
                    fetchTicket();
                  }}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <i className="pi pi-ticket text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Ticket introuvable
          </h3>
          <p className="text-gray-500 mb-6">
            Le ticket que vous recherchez n&apos;existe pas ou a été supprimé
          </p>
          <NavLink
            to="/projects"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="pi pi-arrow-left mr-2"></i>
            Retour aux projets
          </NavLink>
        </div>
      )}

      {/* Dialogs */}
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
          onCancel={() => setDialog(null)}
        />
      </Dialog>

      <Dialog
        header="Supprimer commentaire"
        visible={dialog === "deleteComment"}
        style={{ width: "30vw" }}
        onHide={() => {
          setDialog(null);
        }}
      >
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4 text-center">
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
            <Button label="Annuler" onClick={() => setDialog(null)} />
          </div>
        </div>
      </Dialog>

      <Toast ref={toast} position="top-right" />
    </div>
  );
}

export default TicketDetail;
