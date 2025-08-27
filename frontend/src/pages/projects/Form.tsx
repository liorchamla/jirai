import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { getApi } from "../../utils/api";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import type { Project } from "../../types/Project";
import type { WretchError } from "wretch";
import { Message } from "primereact/message";
import { Dropdown } from "primereact/dropdown";
import {
  MultiSelect,
  type MultiSelectChangeEvent,
} from "primereact/multiselect";
import type { Team } from "../../types/Team";
import { Editor } from "primereact/editor";
import { fetchTeams as apiFetchTeams } from "../../api/teams";

interface PropsType {
  project?: Project;
  onSubmit: () => void;
  onCancel?: () => void;
}

function ProjectForm({ project, onSubmit, onCancel }: PropsType) {
  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");
  const [status, setStatus] = useState(project?.status || "active");
  const [projectTeams, setProjectTeams] = useState<Team[]>(
    project?.teams || []
  );
  const [teams, setTeams] = useState<Team[]>([]);
  const [errorName, setErrorName] = useState<string[]>([]);
  const [errorDescription, setErrorDescription] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await apiFetchTeams();
        setTeams(response);
      } catch (error) {
        // eslint-disable-next-line
        console.error("Erreur lors du chargement des équipes:", error);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    if (project) {
      setName(project.name || "");
      setDescription(project.description || "");
      setStatus(project.status || "active");
    }
  }, [project]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErrorName(() => []);
    setErrorDescription(() => []);
    setError(null);
    if (!project) {
      try {
        createNewProject();
      } catch (error) {
        // eslint-disable-next-line
        console.error(error);
        setError("Une erreur s'est produite lors de la création du projet.");
      }
      return;
    } else {
      try {
        updateProject();
      } catch (error) {
        // eslint-disable-next-line
        console.error(error);
        setError("Une erreur s'est produite lors de la mise à jour du projet.");
      }
    }
  };

  const createNewProject = () => {
    try {
      const teamSlugs = projectTeams.map((team) => team.slug);

      getApi()
        .url("/projects")
        .post({ name, description, status, teams: teamSlugs })
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
      setError("Une erreur s'est produite lors de la création du projet.");
    }
  };

  const updateProject = () => {
    if (!project) {
      return;
    }

    const body: {
      name: string;
      description: string;
      status: string;
      teams: string[];
    } = {
      name,
      description,
      status,
      teams: projectTeams.map((team) => team.slug), // Convertir les objets équipes en tableau de slugs d'équipes
    };

    getApi()
      .url(`/projects/${project.slug}`)
      .patch(body)
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
  };

  function handleApiError(err: WretchError) {
    err.json.error.issues.forEach((error: { path: string[] }) => {
      if (error.path[0] === "name") {
        setErrorName((errorName) => [
          ...errorName,
          "Le nom doit contenir au moins 2 caractères.",
        ]);
      }
      if (error.path[0] === "description") {
        setErrorDescription((errorDescription) => [
          ...errorDescription,
          "La description doit contenir au moins 5 caractères.",
        ]);
      }
    });
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form
        data-testid="project-form"
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* En-tête avec icône */}
        <div className="text-center pb-4 border-b border-gray-200">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
            <i className="pi pi-folder text-blue-600 text-xl"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            {project ? "Modifier le projet" : "Créer un nouveau projet"}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {project
              ? "Modifiez les informations de votre projet"
              : "Définissez les objectifs et paramètres de votre projet"}
          </p>
        </div>

        {/* Section Nom */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <i className="pi pi-tag text-blue-600"></i>
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nom du projet <span className="text-red-500">*</span>
            </label>
          </div>
          <InputText
            id="name"
            placeholder="Ex: Application mobile, Site e-commerce, etc."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
          />
          {errorName.length > 0 && (
            <Message
              severity="error"
              text={errorName.join(", ")}
              className="w-full mt-2"
            />
          )}
        </div>

        {/* Section Description */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <i className="pi pi-file-edit text-green-600"></i>
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Description <span className="text-red-500">*</span>
            </label>
          </div>
          <Editor
            id="description"
            placeholder="Décrivez les objectifs, le contexte et les enjeux de votre projet..."
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
          {/* Statut */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <i className="pi pi-flag text-purple-600"></i>
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
              options={[
                { label: "Actif", value: "active" },
                { label: "Archivé", value: "archived" },
              ]}
              onChange={(e) => {
                setStatus(e.value);
              }}
              className="w-full"
            />
          </div>

          {/* Équipes */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <i className="pi pi-users text-orange-600"></i>
              <label
                htmlFor="teams"
                className="text-sm font-medium text-gray-700"
              >
                Équipes assignées
              </label>
            </div>
            <MultiSelect
              id="teams"
              value={projectTeams}
              onChange={(e: MultiSelectChangeEvent) => setProjectTeams(e.value)}
              options={teams}
              optionLabel="name"
              filter
              display="chip"
              placeholder="Sélectionner les équipes"
              className="w-full"
            />
          </div>
        </div>

        {/* Messages d'erreur globaux */}
        {error && <Message severity="error" text={error} className="w-full" />}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            label="Annuler"
            severity="secondary"
            outlined
            onClick={() => onCancel && onCancel()}
            type="button"
          />
          <Button
            type="submit"
            label={project ? "Modifier le projet" : "Créer le projet"}
            icon={project ? "pi pi-check" : "pi pi-plus"}
            className="px-6 bg-blue-600 hover:bg-blue-700 border-blue-600"
          />
        </div>
      </form>
    </div>
  );
}

export default ProjectForm;
