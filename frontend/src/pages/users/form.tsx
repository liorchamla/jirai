import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import {
  MultiSelect,
  type MultiSelectChangeEvent,
} from "primereact/multiselect";
import { useEffect, useState, type FormEvent } from "react";
import type { User } from "../../types/user";
import { useNavigate } from "react-router-dom";
import { getApi } from "../../utils/api";
import { Message } from "primereact/message";
import type { WretchError } from "wretch";
import type { Team } from "../../types/team";

interface PropsType {
  user?: User;
  onSubmit: () => void;
}

function UserForm({ user, onSubmit }: PropsType) {
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
        .json()
        .then((result) => {
          if (result) {
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
      <label htmlFor="username">Nom d&#39;utilisateur</label>
      <InputText
        id="username"
        type="text"
        placeholder="Nom utilisateur"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      {errorUsername.length > 0 && (
        <Message
          severity="error"
          text={errorUsername.join(", ")}
          className="w-full mb-5"
        />
      )}
      <label htmlFor="email">Email</label>
      <InputText
        id="email"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        invalid={errorEmail.length > 0}
      />
      {errorEmail.length > 0 && (
        <Message
          severity="error"
          text={errorEmail.join(", ")}
          className="w-full mb-5"
        />
      )}
      <label htmlFor="position">Position</label>
      <InputText
        id="position"
        type="text"
        placeholder="Position"
        value={position}
        onChange={(e) => setPosition(e.target.value)}
      />
      {errorPosition.length > 0 && (
        <Message
          severity="error"
          text={errorPosition.join(", ")}
          className="w-full mb-5"
        />
      )}
      <label htmlFor="teams">Équipes</label>
      <MultiSelect
        id="teams"
        value={userTeams}
        onChange={(e: MultiSelectChangeEvent) => setUserTeams(e.value)}
        options={teams}
        optionLabel="name"
        filter
        display="chip"
        placeholder="Équipes"
        className="mb-4"
      />
      <label htmlFor="password">Mot de passe</label>
      <InputText
        id="password"
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4"
      />
      <label htmlFor="confirm-password">Confirmer le mot de passe</label>
      <InputText
        id="confirm-password"
        type="password"
        placeholder="Confirmation mot de passe"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="mb-4"
      />
      {errorPasswordConfirm && (
        <Message
          severity="error"
          text={errorPasswordConfirm}
          className="w-full mb-5"
        />
      )}
      {errorPassword.length > 0 && (
        <Message
          severity="error"
          text={errorPassword.join(", ")}
          className="w-full mb-5"
        />
      )}
      {error && (
        <Message severity="error" text={error} className="w-full mb-5" />
      )}
      <Button label={user ? "Enregistrer" : "Ajouter"} type="submit" />
    </form>
  );
}
export default UserForm;
