import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import type { Epic } from "../../types/Epic";
import { useState, type FormEvent, useEffect } from "react";
import { getApi } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import type { WretchError } from "wretch";
import type { Project } from "../../types/Project";
import { Message } from "primereact/message";
import { Editor } from "primereact/editor";

interface PropsType {
  project?: Project;
  epic?: Epic | null;
  onSubmit: () => void;
}
function EpicForm({ project, epic, onSubmit }: PropsType) {
  const [title, setTitle] = useState(epic?.title || "");
  const [description, setDescription] = useState(epic?.description || "");
  const [priority, setPriority] = useState<Epic["priority"]>(
    epic?.priority || "frozen"
  );
  const [error, setError] = useState<string | null>(null);
  const [errorTitle, setErrorTitle] = useState<string[]>([]);
  const [errorDescription, setErrorDescription] = useState<string[]>([]);

  const navigate = useNavigate();

  // Réinitialiser les champs quand l'epic change
  useEffect(() => {
    setTitle(epic?.title || "");
    setDescription(epic?.description || "");
    setPriority(epic?.priority || "frozen");
    setError(null);
    setErrorTitle([]);
    setErrorDescription([]);
  }, [epic]);

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
      setError("Une erreur s'est produite lors de la création de l'EPIC.");
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
    err.json.error.issues.forEach((error: { path: string[] }) => {
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

  const renderHeader = () => {
    return (
      <span className="ql-formats">
        <button className="ql-bold" aria-label="Bold"></button>
        <button className="ql-italic" aria-label="Italic"></button>
        <button className="ql-underline" aria-label="Underline"></button>
      </span>
    );
  };

  const header = renderHeader();

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
      <label htmlFor="title">Titre de l&apos;EPIC</label>
      <InputText
        id="title"
        placeholder="Titre de l'EPIC"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {errorTitle.length > 0 && (
        <Message
          severity="error"
          text={errorTitle.join(", ")}
          className="w-full mb-5"
        />
      )}
      <label htmlFor="description">Description</label>
      <Editor
        id="description"
        placeholder="Description de l'EPIC"
        value={description}
        onTextChange={(e) => setDescription(e.htmlValue || "")}
        headerTemplate={header}
      />
      {errorDescription.length > 0 && (
        <Message
          severity="error"
          text={errorDescription.join(", ")}
          className="w-full mb-5"
        />
      )}
      <label htmlFor="priority">Priorité</label>
      <Dropdown
        id="priority"
        value={priority}
        options={[
          { label: "Frozen", value: "frozen" },
          { label: "Low", value: "low" },
          { label: "Medium", value: "medium" },
          { label: "High", value: "high" },
        ]}
        onChange={(e) => setPriority(e.value)}
      />
      {error && (
        <Message severity="error" text={error} className="w-full mb-5" />
      )}
      <Button type="submit" label={epic ? "Modifier l'EPIC" : "Créer l'EPIC"} />
    </form>
  );
}

export default EpicForm;
