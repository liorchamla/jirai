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
import { Toast } from "primereact/toast";
import type { Toast as ToastType } from "primereact/toast";

interface PropsType {
  project?: Project;
  epic?: Epic | null;
  onSubmit: () => void;
  onCancel?: () => void;
}
function EpicForm({ project, epic, onSubmit, onCancel }: PropsType) {
  const [title, setTitle] = useState(epic?.title || "");
  const [description, setDescription] = useState(epic?.description || "");
  const [assigned, setAssigned] = useState<string[]>([]);
  const [priority, setPriority] = useState<Epic["priority"]>(
    epic?.priority || "frozen"
  );
  const [status, setStatus] = useState<Epic["status"]["name"]>(
    epic?.status?.name || "thinking"
  );
  const [users, setUsers] = useState<{ uuid: string; username: string }[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [errorTitle, setErrorTitle] = useState<string[]>([]);
  const [errorDescription, setErrorDescription] = useState<string[]>([]);
  const [loadingDescription, setLoadingDescription] = useState(false);

  const navigate = useNavigate();

  const toast = useRef<ToastType>(null);

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
        return "pi pi-chevron-circle-down";
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

  // Récupérer les utilisateurs du projet
  const fetchUsers = async () => {
    try {
      const projectSlug = project?.slug || epic?.projectSlug;
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

  // Réinitialiser les champs quand l'epic change
  useEffect(() => {
    const initializeForm = async () => {
      setTitle(epic?.title || "");
      setDescription(epic?.description || "");
      setPriority(epic?.priority || "frozen");
      setError(null);
      setErrorTitle([]);
      setErrorDescription([]);

      // Récupérer d'abord les utilisateurs et les statuts
      await Promise.all([fetchUsers(), fetchStatuses()]);

      // Puis initialiser les assignés - convertir la valeur unique en tableau
      if (epic?.assignedTo) {
        setAssigned([epic.assignedTo]);
      } else {
        setAssigned([]);
      }
    };

    initializeForm();
  }, [epic, project]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      if (epic) {
        updateEpic();
      } else {
        createNewEpic();
      }
    } catch (error) {
      // eslint-disable-next-line
      console.error(error);
      setError(
        "Une erreur s'est produite lors de la création ou la modification de l'EPIC."
      );
    }
  };

  const createNewEpic = () => {
    try {
      getApi()
        .url("/epics")
        .post({
          title,
          description,
          priority,
          projectSlug: project?.slug,
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
      setError("Une erreur s'est produite lors de la création de l'EPIC.");
    }
  };

  const updateEpic = () => {
    try {
      getApi()
        .url(`/epics/${epic?.id}`)
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
      setError("Une erreur s'est produite lors de la modification de l'EPIC.");
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

  const fetchEpicDescription = async () => {
    try {
      setLoadingDescription(true);
      const response: { description: string } = await getApi()
        .url(`/automation/${project?.slug || epic?.projectSlug}/epic/`)
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
      console.error("Error fetching epic description:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* En-tête avec icône */}
        <div className="text-center pb-4 border-b border-gray-200">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
            <i className="pi pi-bookmark text-purple-600 text-xl"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            {epic ? "Modifier l'EPIC" : "Créer une nouvelle EPIC"}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {epic
              ? "Modifiez les informations de votre EPIC"
              : "Définissez les objectifs et paramètres de votre EPIC"}
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
              Titre de l&apos;EPIC <span className="text-red-500">*</span>
            </label>
          </div>
          <InputText
            id="title"
            placeholder="Ex: Système d'authentification utilisateur"
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
                fetchEpicDescription();
                setErrorTitle([]);
              }}
              className="text-xs"
              tooltip="Générer une description avec l'IA"
            />
          </div>
          <Editor
            id="description"
            placeholder="Décrivez les objectifs, les fonctionnalités attendues et les critères d'acceptation..."
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
                  onClick={() => setPriority(option.value as Epic["priority"])}
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
            label={epic ? "Modifier l'épique" : "Créer l'épique"}
            icon={epic ? "pi pi-check" : "pi pi-plus"}
            className="px-6 bg-blue-600 hover:bg-blue-700 border-blue-600"
          />
        </div>
      </form>
      <Toast ref={toast} />
    </div>
  );
}

export default EpicForm;
