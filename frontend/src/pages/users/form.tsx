import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import {
  MultiSelect,
  type MultiSelectChangeEvent,
} from "primereact/multiselect";
import { useState, type FormEvent } from "react";
import type { User } from "../../types/user";

interface Teams {
  name: string;
}

interface PropsType {
  user?: User;
  onSubmit: () => void;
}

function UserForm({ user, onSubmit }: PropsType) {
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [position, setPosition] = useState(user?.position || "");
  const [userTeams, setUserTeams] = useState<Teams[]>(user?.teams || []);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  const teams: Teams[] = [
    { name: "Web dev" },
    { name: "QA" },
    { name: "Product" },
    { name: "Marketing" },
    { name: "Sales" },
    { name: "Support" },
  ];

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
      <label htmlFor="email">Email</label>
      <InputText
        id="email"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label htmlFor="position">Position</label>
      <InputText
        id="position"
        type="text"
        placeholder="Position"
        value={position}
        onChange={(e) => setPosition(e.target.value)}
      />
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
      <Button label={user ? "Enregistrer" : "Ajouter"} type="submit" />
    </form>
  );
}
export default UserForm;
