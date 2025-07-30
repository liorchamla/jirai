import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { getApi } from "../../utils/api";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import type { Project } from "../../types/project";
import type { WretchError } from "wretch";
import { Message } from "primereact/message";
import { Dropdown } from "primereact/dropdown";
import {
  MultiSelect,
  type MultiSelectChangeEvent,
} from "primereact/multiselect";
import type { Team } from "../../types/team";
import { Editor } from "primereact/editor";

interface PropsType {
  project?: Project;
  onSubmit: () => void;
}

function ProjectForm({ project, onSubmit }: PropsType) {
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
        const response = (await getApi().get("/teams").json()) as {
          teams: Team[];
        };
        setTeams(response.teams);
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
      <label htmlFor="name">Nom du projet</label>
      <InputText
        id="name"
        placeholder="Nom du projet"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {errorName.length > 0 && (
        <Message
          severity="error"
          text={errorName.join(", ")}
          className="w-full mb-5"
        />
      )}
      <label htmlFor="description">Description</label>
      <Editor
        id="description"
        placeholder="Description du projet"
        value={description}
        onTextChange={(e) => setDescription(e.htmlValue || "")}
      />
      {errorDescription.length > 0 && (
        <Message
          severity="error"
          text={errorDescription.join(", ")}
          className="w-full mb-5"
        />
      )}
      <label htmlFor="status">Statut</label>
      <Dropdown
        value={status}
        options={[
          { label: "Active", value: "active" },
          { label: "Archived", value: "archived" },
        ]}
        onChange={(e) => {
          setStatus(e.value);
        }}
      />
      {error && (
        <Message severity="error" text={error} className="w-full mb-5" />
      )}
      <label htmlFor="teams">Équipes</label>
      <MultiSelect
        id="teams"
        value={projectTeams}
        onChange={(e: MultiSelectChangeEvent) => setProjectTeams(e.value)}
        options={teams}
        optionLabel="name"
        filter
        display="chip"
        placeholder="Équipes"
        className="mb-4"
      />
      <Button
        type="submit"
        label={project ? "Mettre à jour le projet" : "Créer le projet"}
      />
    </form>
  );
}

export default ProjectForm;
