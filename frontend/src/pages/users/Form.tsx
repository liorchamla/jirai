import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import {
  MultiSelect,
  type MultiSelectChangeEvent,
} from "primereact/multiselect";
import { useContext, useEffect, useState, type FormEvent } from "react";
import type { User } from "../../types/User";
import { useNavigate } from "react-router-dom";
import { getApi } from "../../utils/api";
import { Message } from "primereact/message";
import type { WretchError } from "wretch";
import type { Team } from "../../types/Team";
import { AuthContext } from "../../utils/auth";

interface PropsType {
  user?: User;
  onSubmit: () => void;
  onCancel?: () => void;
}

function UserForm({ user, onSubmit, onCancel }: PropsType) {
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [position, setPosition] = useState(user?.position || "");
  const [userTeams, setUserTeams] = useState<Team[]>(user?.teams || []);
  const [teams, setTeams] = useState<Team[]>([]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [errorUsername, setErrorUsername] = useState<string[]>([]);
  const [errorEmail, setErrorEmail] = useState<string[]>([]);
  const [errorPosition, setErrorPosition] = useState<string[]>([]);
  const [errorPassword, setErrorPassword] = useState<string[]>([]);
  const [errorPasswordConfirm, setErrorPasswordConfirm] = useState<
    string | null
  >(null);

  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErrorUsername(() => []);
    setErrorEmail(() => []);
    setErrorPosition(() => []);
    setErrorPassword(() => []);
    setErrorPasswordConfirm(null);
    setError(null);
    if (!user) {
      if (password !== confirmPassword) {
        setErrorPasswordConfirm("Les mots de passe ne correspondent pas.");
        return;
      }
      try {
        createNewUser();
      } catch (error) {
        // eslint-disable-next-line
        console.error(error);
        setError(
          "Une erreur s'est produite lors de la création de l'utilisateur."
        );
      }
    } else {
      if (password !== confirmPassword) {
        setErrorPasswordConfirm("Les mots de passe ne correspondent pas.");
        return;
      }
      try {
        updateUser();
      } catch (error) {
        // eslint-disable-next-line
        console.error(error);
        setError(
          "Une erreur s'est produite lors de la mise à jour de l'utilisateur."
        );
      }
    }
  };

  async function createNewUser() {
    try {
      // Convertir les objets équipes en tableau de slugs d'équipes
      const teamSlugs = userTeams.map((team) => team.slug);

      getApi()
        .url("/users")
        .post({ username, email, position, password, teams: teamSlugs })
        .unauthorized(() => {
          navigate("/login");
        })
        .error(409, (err) => {
          setError(() => err.json.error);
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
      setError(
        "Une erreur s'est produite lors de la création de l'utilisateur."
      );
    }
  }

  async function updateUser() {
    if (!user) {
      return;
    }

    const body: {
      username: string;
      email: string;
      position: string;
      password?: string;
      teams?: string[];
    } = {
      username,
      email,
      position,
      teams: userTeams.map((team) => team.slug), // Convertir les objets équipes en tableau de slugs d'équipes
    };

    if (password) {
      body.password = password;
    }
    try {
      getApi()
        .url("/users/" + user.uuid)
        .patch(body)
        .unauthorized(() => {
          navigate("/login");
        })
        .error(409, (err) => {
          setError(() => err.json.error);
        })
        .error(422, (err) => {
          handleApiError(err);
        })
        .json<{ message: string; user: User }>()
        .then((result) => {
          if (result) {
            // Si l'utilisateur modifie son propre profil, mettre à jour le contexte d'authentification
            if (authContext?.userInfo?.uuid === result.user.uuid) {
              authContext.updateUserInfo({
                username: result.user.username,
                email: result.user.email,
              });
            }
            onSubmit();
          }
        });
    } catch (err) {
      if ((err as WretchError).status === 409) {
        setError(() => (err as WretchError).json.error);
      } else if ((err as WretchError).status === 422) {
        handleApiError(err as WretchError);
      } else {
        // eslint-disable-next-line
        console.error("Unexpected error:", err);
      }
    }
  }

  function handleApiError(err: WretchError) {
    err.json.error.forEach((error: { path: string[]; message: string }) => {
      if (error.path[0] === "username") {
        setErrorUsername((errorUsername) => [...errorUsername, error.message]);
      }
      if (error.path[0] === "email") {
        setErrorEmail((errorEmail) => [...errorEmail, error.message]);
      }
      if (error.path[0] === "password") {
        setErrorPassword((errorPassword) => [...errorPassword, error.message]);
      }
    });
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <i className="pi pi-user text-3xl text-blue-600"></i>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {user ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
          </h1>
          <p className="text-gray-600 mt-1">
            {user
              ? "Modifiez les informations de l'utilisateur"
              : "Créez un nouvel utilisateur"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations personnelles */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <i className="pi pi-user text-blue-600"></i>
            Informations personnelles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nom d&apos;utilisateur
              </label>
              <InputText
                id="username"
                type="text"
                placeholder="Nom utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full"
                invalid={errorUsername.length > 0}
              />
              {errorUsername.length > 0 && (
                <Message
                  severity="error"
                  text={errorUsername.join(", ")}
                  className="w-full mt-2"
                />
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <InputText
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                invalid={errorEmail.length > 0}
              />
              {errorEmail.length > 0 && (
                <Message
                  severity="error"
                  text={errorEmail.join(", ")}
                  className="w-full mt-2"
                />
              )}
            </div>

            <div>
              <label
                htmlFor="position"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Position
              </label>
              <InputText
                id="position"
                type="text"
                placeholder="Position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full"
                invalid={errorPosition.length > 0}
              />
              {errorPosition.length > 0 && (
                <Message
                  severity="error"
                  text={errorPosition.join(", ")}
                  className="w-full mt-2"
                />
              )}
            </div>

            <div>
              <label
                htmlFor="teams"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Équipes
              </label>
              <MultiSelect
                id="teams"
                value={userTeams}
                onChange={(e: MultiSelectChangeEvent) => setUserTeams(e.value)}
                options={teams}
                optionLabel="name"
                filter
                display="chip"
                placeholder="Sélectionner les équipes"
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Sécurité */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <i className="pi pi-lock text-blue-600"></i>
            Sécurité
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {user ? "Nouveau mot de passe (optionnel)" : "Mot de passe"}
              </label>
              <InputText
                id="password"
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                invalid={errorPassword.length > 0}
              />
              {errorPassword.length > 0 && (
                <Message
                  severity="error"
                  text={errorPassword.join(", ")}
                  className="w-full mt-2"
                />
              )}
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirmer le mot de passe
              </label>
              <InputText
                id="confirm-password"
                type="password"
                placeholder="Confirmation mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full"
                invalid={!!errorPasswordConfirm}
              />
              {errorPasswordConfirm && (
                <Message
                  severity="error"
                  text={errorPasswordConfirm}
                  className="w-full mt-2"
                />
              )}
            </div>
          </div>
        </div>

        {/* Messages d'erreur globaux */}
        {error && <Message severity="error" text={error} className="w-full" />}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <Button
            label="Annuler"
            severity="secondary"
            outlined
            onClick={() => onCancel && onCancel()}
            type="button"
          />
          <Button
            label={user ? "Enregistrer" : "Créer l'utilisateur"}
            icon={user ? "pi pi-save" : "pi pi-plus"}
            type="submit"
          />
        </div>
      </form>
    </div>
  );
}
export default UserForm;
