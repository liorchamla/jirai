import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Link, useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { useCallback, useEffect, useRef, useState } from "react";
import UserForm from "./form";
import type { User } from "../../types/user";
import { getApi } from "../../utils/api";
import { Toast } from "primereact/toast";

function UsersList() {
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);
  const [dialog, setDialog] = useState<"add" | "update" | "delete" | null>(
    null
  );

  const toast = useRef<Toast>(null);

  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    const result: { users: User[] } = await getApi().get("/users").json();
    setUsers(result.users);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setDialog("delete");
  };

  const handleConfirmDelete = async (user: User) => {
    try {
      setIsLoadingDelete(true);
      await getApi().delete(`/users/${user.uuid}`);
      setIsLoadingDelete(false);
      setDialog(null);
      fetchUsers(); // Rafraîchir la liste
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Utilisateur supprimé avec succès",
        life: 3000,
      });
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail:
          "Une erreur s'est produite lors de la suppression de l'utilisateur",
      });
    }
  };

  const getUserActions = (user: User) => {
    return (
      <>
        <Button
          onClick={() => navigate(`/users/${user.uuid}`)}
          icon="pi pi-eye"
          severity="info"
          text
        />
        <Button
          onClick={() => {
            setSelectedUser(user);
            setDialog("update");
          }}
          icon="pi pi-pencil"
          severity="success"
          text
        />
        <Button
          icon="pi pi-times"
          severity="danger"
          onClick={() => {
            handleDelete(user);
          }}
          className="ml-2"
          text
        />
      </>
    );
  };

  const getUserEmail = (user: User) => {
    return (
      <div className="flex items-center gap-2">
        <i className="pi pi-envelope" />
        {user.email}
      </div>
    );
  };

  const getUserTeams = (user: User) => {
    if (!user.teams || user.teams.length === 0) {
      return <span className="text-gray-500">Aucune équipe</span>;
    }

    return (
      <div className="flex flex-wrap gap-1">
        {user.teams.map((team) => (
          <span
            key={team.slug}
            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
          >
            {team.name}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-5 py-5 px-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Liste des utilisateurs</h1>
        <Button
          icon="pi pi-plus"
          label="Ajouter un utilisateur"
          onClick={() => setDialog("add")}
          size="small"
        />
        <Dialog
          header="Ajouter un utilisateur"
          visible={dialog === "add"}
          style={{ width: "60vw" }}
          onHide={() => {
            setDialog(null);
          }}
        >
          <UserForm
            onSubmit={() => {
              setDialog(null);
              fetchUsers();
            }}
          />
        </Dialog>
        <Dialog
          header="Modifier utilisateur"
          visible={dialog === "update"}
          style={{ width: "60vw" }}
          onHide={() => {
            setDialog(null);
          }}
        >
          <UserForm
            user={selectedUser}
            onSubmit={() => {
              setDialog(null);
              fetchUsers();
            }}
          />
        </Dialog>
        <Dialog
          header="Supprimer utilisateur"
          visible={dialog === "delete"}
          style={{ width: "30vw" }}
          onHide={() => {
            setDialog(null);
          }}
        >
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-4">
              Êtes-vous sûr de vouloir supprimer cet utilisateur &quot;
              {selectedUser?.username}&quot; ?
            </h2>
            <div className="flex gap-2">
              <Button
                label="Confirmer"
                severity="danger"
                onClick={() => {
                  if (selectedUser) {
                    handleConfirmDelete(selectedUser);
                  }
                }}
                loading={isLoadingDelete}
              />
              <Button
                label="Annuler"
                className="mt-2"
                onClick={() => setDialog(null)}
              />
            </div>
          </div>
        </Dialog>
      </div>
      <DataTable value={users} loading={isLoading}>
        <Column field="username" header="Username" />
        <Column body={getUserEmail} header="Email" />
        <Column field="position" header="Position" />
        <Column body={getUserTeams} header="Teams" />
        <Column body={getUserActions} header="Actions" />
      </DataTable>
      <Link to="/login" className="btn btn-primary">
        Go to Login
      </Link>
      <Toast ref={toast} position="top-right" />
    </div>
  );
}
export default UsersList;
