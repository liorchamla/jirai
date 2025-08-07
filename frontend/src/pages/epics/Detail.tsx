import { NavLink, useParams } from "react-router-dom";
import type { Epic } from "../../types/Epic";
import { getApi } from "../../utils/api";
import React, { useEffect, useRef, useState } from "react";
import DOMpurify from "dompurify";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import EpicForm from "./EpicForm";
import PriorityBadge from "../../components/PriorityBadge";
import TicketForm from "../tickets/TicketForm";
import type { Ticket } from "../../types/Ticket";
import StatusBadge from "../../components/StatusBadge";
import { Panel } from "primereact/panel";
import CommentForm from "../comments/commentForm";

function EpicDetail() {
  const [epic, setEpic] = useState<Epic | null>(null);
  const [dialog, setDialog] = useState<"update" | null>(null);
  const [ticketDialog, setTicketDialog] = useState<"add" | "update" | null>(
    null
  );
  const [commentDialog, setCommentDialog] = useState<"add" | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const params = useParams();
  const { id } = params;

  const fetchEpic = React.useCallback(async () => {
    const result: Epic = await getApi().get(`/epics/${id}`).json();
    setEpic(result);
  }, [id]);

  useEffect(() => {
    fetchEpic();
  }, [fetchEpic]);

  const ref = useRef<Panel | null>(null);

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
        <span className="text-2xl mt-3">Commentaires</span>
        <div className="flex justify-start">
          <Button
            className="w-auto"
            icon="pi pi-plus"
            label="Ajouter un commentaire à l'EPIC"
            onClick={() => setCommentDialog("add")}
            size="small"
          />
          <Dialog
            header="Ajouter un commentaire"
            visible={commentDialog === "add"}
            style={{ width: "60vw" }}
            onHide={() => setCommentDialog(null)}
          >
            {epic && (
              <CommentForm
                epic={epic}
                onSubmit={() => {
                  setCommentDialog(null);
                  fetchEpic(); // Rafraîchir les données de l'EPIC pour afficher le nouveau commentaire
                }}
              />
            )}
          </Dialog>
        </div>
        {epic?.comments && epic.comments.length > 0 && (
          <div className="card flex md:justify-content-center">
            <ul className="m-0 border border-gray-300 p-3 w-full">
              {epic.comments.map((comment) => (
                <Panel
                  key={comment.id}
                  ref={ref}
                  className="mb-2"
                  header={comment.creator.username}
                  footer={
                    <div className="flex justify-end">
                      <span className="text-sm text-gray-500 px-2 py-1">
                        {new Date(comment.createdAt).toLocaleString("fr-FR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
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
      </div>
    </div>
  );
}

export default EpicDetail;
