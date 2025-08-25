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
  onCancel?: () => void;
}

function TeamForm({ team, onSubmit, onCancel }: PropsType) {
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
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* En-tête avec icône */}
        <div className="text-center pb-4 border-b border-gray-200">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
            <i className="pi pi-users text-green-600 text-xl"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            {team ? "Modifier l'équipe" : "Créer une nouvelle équipe"}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {team
              ? "Modifiez les informations de votre équipe"
              : "Définissez le nom et les paramètres de votre équipe"}
          </p>
        </div>

        {/* Section Nom */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <i className="pi pi-tag text-blue-600"></i>
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nom de l&apos;équipe <span className="text-red-500">*</span>
            </label>
          </div>
          <InputText
            id="name"
            placeholder="Ex: Équipe développement, Marketing, etc."
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
            label={team ? "Modifier l'équipe" : "Créer l'équipe"}
            icon={team ? "pi pi-check" : "pi pi-plus"}
            className="px-6 bg-blue-600 hover:bg-blue-700 border-blue-600"
          />
        </div>
      </form>
    </div>
  );
}

export default TeamForm;
