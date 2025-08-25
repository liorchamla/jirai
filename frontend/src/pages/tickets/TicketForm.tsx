import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import type { Epic } from "../../types/Epic";
import { useState, type FormEvent, useEffect, useRef } from "react";
import { getApi } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import type { WretchError } from "wretch";
import type { Project } from "../../types/Project";
import type { Status } from "../../types/Status";
import { Message } from "primereact/message";
import { Editor } from "primereact/editor";
import type { Ticket } from "../../types/Ticket";
import { Toast } from "primereact/toast";

interface PropsType {
  project?: Project;
  epic?: Epic | null;
  ticket?: Ticket | null;
  onSubmit: () => void;
  onCancel?: () => void;
}
function TicketForm({ project, epic, ticket, onSubmit, onCancel }: PropsType) {
  const [title, setTitle] = useState(ticket?.title || "");
  const [description, setDescription] = useState(ticket?.description || "");
  const [assigned, setAssigned] = useState<string[]>([]);
  const [priority, setPriority] = useState<Ticket["priority"]>(
    ticket?.priority || "frozen"
  );
  const [status, setStatus] = useState<Ticket["status"]["name"]>(
    ticket?.status?.name || "thinking"
  );
  const [users, setUsers] = useState<{ uuid: string; username: string }[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [errorTitle, setErrorTitle] = useState<string[]>([]);
  const [errorDescription, setErrorDescription] = useState<string[]>([]);
  const [loadingDescription, setLoadingDescription] = useState(false);

  const navigate = useNavigate();

  const toast = useRef<Toast>(null);

  // Helper pour obtenir le label d'un statut
  const getStatusLabel = (statusName: string): string => {
    switch (statusName) {
      case "thinking":
        return "En réflexion";
      case "ready":
        return "Prêt";
      case "in_progress":
        return "En cours";
      case "done":
        return "Terminé";
      case "canceled":
        return "Annulé";
      default:
        return statusName;
    }
  };

  // Helper pour obtenir l'icône d'un statut
  const getStatusIcon = (statusName: string): string => {
    switch (statusName) {
      case "thinking":
        return "pi pi-minus-circle";
      case "ready":
        return "pi pi-circle";
      case "in_progress":
        return "pi pi-play-circle";
      case "done":
        return "pi pi-check-circle";
      case "canceled":
        return "pi pi-times-circle";
      default:
        return "pi pi-circle";
    }
  };

  // Helper pour obtenir la couleur d'un statut
  const getStatusIconColor = (statusName: string): string => {
    switch (statusName) {
      case "thinking":
        return "text-gray-500";
      case "ready":
        return "text-blue-500";
      case "in_progress":
        return "text-yellow-500";
      case "done":
        return "text-green-500";
      case "canceled":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  // Fonction pour réinitialiser le formulaire
  const resetForm = async () => {
    setTitle(ticket?.title || "");
    setDescription(ticket?.description || "");
    setPriority(ticket?.priority || "frozen");
    setStatus(ticket?.status?.name || "thinking");
    setError(null);
    setErrorTitle([]);
    setErrorDescription([]);

    // Récupérer d'abord les utilisateurs et les statuts
    await Promise.all([fetchUsers(), fetchStatuses()]);

    // Puis initialiser les assignés
    if (ticket?.assignedTo) {
      setAssigned([ticket.assignedTo]);
    } else {
      setAssigned([]);
    }
  };

  // Récupérer les statuts
  const fetchStatuses = async () => {
    try {
      const statusesData: Status[] = await getApi().get("/status").json();
      setStatuses(statusesData);
      return statusesData;
    } catch (error) {
      // eslint-disable-next-line
      console.error("Error fetching statuses:", error);
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: "Impossible de récupérer la liste des statuts.",
      });
      return [];
    }
  };

  // Récupérer les utilisateurs du projet
  const fetchUsers = async () => {
    try {
      let projectSlug =
        project?.slug || epic?.projectSlug || ticket?.epic?.projectSlug;

      if (projectSlug) {
        const usersData: { uuid: string; username: string }[] = await getApi()
          .get(`/projects/${projectSlug}/users`)
          .json();
        setUsers(usersData);
        return usersData;
      }
      return [];
    } catch (error) {
      // eslint-disable-next-line
      console.error("Error fetching users:", error);
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: "Impossible de récupérer la liste des utilisateurs.",
      });
      return [];
    }
  };

  // Réinitialiser les champs quand le ticket change
  useEffect(() => {
    resetForm();
  }, [ticket, project, epic]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      if (ticket) {
        updateTicket();
      } else {
        createNewTicket();
      }
    } catch (error) {
      // eslint-disable-next-line
      console.error(error);
      setError(
        "Une erreur s'est produite lors de la création ou la modification du TICKET."
      );
    }
  };

  const createNewTicket = () => {
    try {
      getApi()
        .url("/tickets")
        .post({
          title,
          description,
          priority,
          epicId: epic?.id,
          status,
          assignedTo: assigned.length > 0 ? assigned[0] : undefined,
        })
        .unauthorized(() => {
          navigate("/login");
        })
        .error(422, (err) => {
          handleApiError(err);
        })
        .json()
        .then((result) => {
          if (result) {
            onSubmit();
          }
        });
    } catch (error) {
      // eslint-disable-next-line
      console.error(error);
      setError("Une erreur s'est produite lors de la création du TICKET.");
    }
  };

  const updateTicket = () => {
    try {
      getApi()
        .url(`/tickets/${ticket?.id}`)
        .patch({
          title,
          description,
          priority,
          status,
          assignedTo: assigned.length > 0 ? assigned[0] : undefined,
        })
        .unauthorized(() => {
          navigate("/login");
        })
        .error(422, (err) => {
          handleApiError(err);
        })
        .json()
        .then((result) => {
          if (result) {
            onSubmit();
          }
        });
    } catch (error) {
      // eslint-disable-next-line
      console.error(error);
      setError("Une erreur s'est produite lors de la modification du TICKET.");
    }
  };

  function handleApiError(err: WretchError) {
    // Réinitialiser les erreurs avant d'ajouter les nouvelles
    setErrorTitle([]);
    setErrorDescription([]);

    // Déterminer quelle structure d'erreur utiliser
    const issues = err.json.error?.issues || err.json.issues;

    if (issues) {
      issues.forEach((error: { path: string[] }) => {
        if (error.path[0] === "title") {
          setErrorTitle((errorTitle) => [
            ...errorTitle,
            "Le titre doit contenir au moins 2 caractères.",
          ]);
        }
        if (error.path[0] === "description") {
          setErrorDescription((errorDescription) => [
            ...errorDescription,
            "La description doit contenir au moins 2 caractères.",
          ]);
        }
      });
    }
  }

  const fetchTicketDescription = async () => {
    try {
      setLoadingDescription(true);
      const response: { description: string } = await getApi()
        .url(`/automation/${epic?.id || ticket?.epicId}/ticket/`)
        .post({ title })
        .error(422, (err) => {
          handleApiError(err);
          setLoadingDescription(false);
        })
        .json();
      if (errorDescription.length > 0) {
        setLoadingDescription(false);
        return;
      }
      setDescription(response.description);
      setLoadingDescription(false);
    } catch (error) {
      // eslint-disable-next-line
      console.error("Error fetching ticket description:", error);
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: "Impossible de récupérer la description du TICKET.",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* En-tête avec icône */}
        <div className="text-center pb-4 border-b border-gray-200">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
            <i className="pi pi-ticket text-blue-600 text-xl"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            {ticket ? "Modifier le TICKET" : "Créer un nouveau TICKET"}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {ticket
              ? "Modifiez les informations de votre TICKET"
              : "Définissez les détails et paramètres de votre TICKET"}
          </p>
        </div>

        {/* Section Titre */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <i className="pi pi-tag text-blue-600"></i>
            <label
              htmlFor="title"
              className="text-sm font-medium text-gray-700"
            >
              Titre du TICKET <span className="text-red-500">*</span>
            </label>
          </div>
          <InputText
            id="title"
            placeholder="Ex: Corriger le bug de connexion"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full"
          />
          {errorTitle.length > 0 && (
            <Message
              severity="error"
              text={errorTitle.join(", ")}
              className="w-full mt-2"
            />
          )}
        </div>

        {/* Section Description */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <i className="pi pi-file-edit text-green-600"></i>
              <label
                htmlFor="description"
                className="text-sm font-medium text-gray-700"
              >
                Description <span className="text-red-500">*</span>
              </label>
            </div>
            <Button
              type="button"
              icon="pi pi-sparkles"
              label="IA Assistant"
              size="small"
              outlined
              loading={loadingDescription}
              onClick={() => {
                fetchTicketDescription();
                setErrorTitle([]);
              }}
              className="text-xs"
              tooltip="Générer une description avec l'IA"
            />
          </div>
          <Editor
            id="description"
            placeholder="Décrivez le problème, les étapes à reproduire et les critères d'acceptation..."
            value={description}
            onTextChange={(e) => setDescription(e.htmlValue || "")}
            style={{ height: "200px" }}
          />
          {errorDescription.length > 0 && (
            <Message
              severity="error"
              text={errorDescription.join(", ")}
              className="w-full mt-2"
            />
          )}
        </div>

        {/* Section Configuration - Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Assignation */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <i className="pi pi-user text-orange-600"></i>
              <label
                htmlFor="assigned"
                className="text-sm font-medium text-gray-700"
              >
                Assigné à
              </label>
            </div>
            <Dropdown
              id="assigned"
              value={assigned.length > 0 ? assigned[0] : null}
              options={[
                { label: "Non assigné", value: null },
                ...users.map((user) => ({
                  label: user.username,
                  value: user.uuid,
                })),
              ]}
              onChange={(e) => setAssigned(e.value ? [e.value] : [])}
              placeholder="Sélectionner un utilisateur"
              filter
              className="w-full"
              showClear
            />
          </div>

          {/* Statut */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <i className="pi pi-flag text-blue-600"></i>
              <label
                htmlFor="status"
                className="text-sm font-medium text-gray-700"
              >
                Statut
              </label>
            </div>
            <Dropdown
              id="status"
              value={status}
              options={statuses.map((statusItem) => ({
                label: getStatusLabel(statusItem.name),
                value: statusItem.name,
                icon: getStatusIcon(statusItem.name),
                iconColor: getStatusIconColor(statusItem.name),
              }))}
              onChange={(e) => setStatus(e.value)}
              className="w-full"
              itemTemplate={(option) => (
                <div className="flex items-center gap-2">
                  {option.icon?.startsWith("pi") ? (
                    <i className={`${option.icon} ${option.iconColor}`}></i>
                  ) : (
                    <span className={option.iconColor}>{option.icon}</span>
                  )}
                  <span className="text-gray-900">{option.label}</span>
                </div>
              )}
              valueTemplate={(option) =>
                option ? (
                  <div className="flex items-center gap-2">
                    {option.icon?.startsWith("pi") ? (
                      <i className={`${option.icon} ${option.iconColor}`}></i>
                    ) : (
                      <span className={option.iconColor}>{option.icon}</span>
                    )}
                    <span className="text-gray-900">{option.label}</span>
                  </div>
                ) : null
              }
            />
          </div>

          {/* Priorité */}
          <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <i className="pi pi-exclamation-triangle text-red-600"></i>
              <label
                htmlFor="priority"
                className="text-sm font-medium text-gray-700"
              >
                Priorité
              </label>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {
                  label: "Gelée",
                  value: "frozen",
                  color: "bg-blue-500",
                },
                {
                  label: "Basse",
                  value: "low",
                  color: "bg-green-700",
                },
                {
                  label: "Moyenne",
                  value: "medium",
                  color: "bg-orange-300",
                },
                {
                  label: "Haute",
                  value: "high",
                  color: "bg-red-700",
                },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setPriority(option.value as Ticket["priority"])
                  }
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 text-white ${
                    priority === option.value
                      ? `${option.color} border-gray-800 shadow-lg scale-105`
                      : `${option.color} border-transparent hover:border-gray-300 hover:shadow-md`
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Messages d'erreur globaux */}
        {error && <Message severity="error" text={error} className="w-full" />}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            label="Annuler"
            outlined
            onClick={() => {
              if (onCancel) {
                onCancel();
              }
            }}
            className="px-6"
          />
          <Button
            type="submit"
            label={ticket ? "Modifier le ticket" : "Créer le ticket"}
            icon={ticket ? "pi pi-check" : "pi pi-plus"}
            className="px-6 bg-blue-600 hover:bg-blue-700 border-blue-600"
          />
        </div>
      </form>
      <Toast ref={toast} />
    </div>
  );
}

export default TicketForm;
