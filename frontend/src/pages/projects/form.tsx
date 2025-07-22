import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { getApi } from "../../utils/api";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import type { Project } from "../../types/project";
import type { WretchError } from "wretch";
import { Message } from "primereact/message";
import { Dropdown } from "primereact/dropdown";

interface PropsType {
  project?: Project;
  onSubmit: () => void;
}

function ProjectForm({ project, onSubmit }: PropsType) {
  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");
  const [status, setStatus] = useState(project?.status || "active");
  const [errorName, setErrorName] = useState<string[]>([]);
  const [errorDescription, setErrorDescription] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

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
      getApi()
        .url("/projects")
        .post({ name, description, status })
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

    const body: { name: string; description: string; status: string } = {
      name,
      description,
      status,
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
      <InputText
        id="description"
        placeholder="Description du projet"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
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
      <Button type="submit" label="Créer le projet" />
    </form>
  );
}

export default ProjectForm;
