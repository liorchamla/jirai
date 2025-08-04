import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState, type FormEvent } from "react";
import { getApi } from "../../utils/api";
import type { Team } from "../../types/Team";
import { useNavigate } from "react-router-dom";
import type { WretchError } from "wretch";
import { Message } from "primereact/message";

interface PropsType {
  team?: Team;
  onSubmit: () => void;
}

function TeamForm({ team, onSubmit }: PropsType) {
  const [name, setName] = useState(team?.name || "");
  const [errorName, setErrorName] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setErrorName(() => []);
    setError(null);
    if (!team) {
      try {
        createNewTeam();
      } catch (error) {
        // eslint-disable-next-line
        console.error(error);
        setError("Une erreur s'est produite lors de la création de l'équipe.");
      }
    } else {
      try {
        updateTeam();
      } catch (error) {
        // eslint-disable-next-line
        console.error(error);
        setError(
          "Une erreur s'est produite lors de la mise à jour de l'équipe."
        );
      }
    }
  };

  const createNewTeam = () => {
    try {
      getApi()
        .url("/teams")
        .post({ name })
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
      setError("Une erreur s'est produite lors de la création de l'équipe.");
    }
  };

  function handleApiError(err: WretchError) {
    const errorResponse = err.json.error.name._errors;
    if (errorResponse && errorResponse.length > 0) {
      setErrorName(["Le nom de l'équipe doit contenir au moins 2 caractères."]);
    }
  }

  const updateTeam = () => {
    if (!team) {
      return;
    }

    const body: { name: string } = {
      name,
    };

    getApi()
      .url(`/teams/${team.slug}`)
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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
      <label htmlFor="name">Nom de l&apos;équipe</label>
      <InputText
        id="name"
        placeholder="Nom de l'équipe"
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
      {error && (
        <Message severity="error" text={error} className="w-full mb-5" />
      )}
      <Button
        type="submit"
        label={team ? "Mettre à jour l'équipe" : "Créer l'équipe"}
      />
    </form>
  );
}

export default TeamForm;
