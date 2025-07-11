import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Link, useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import UserForm from "./form";
import type { User } from "../../types/user";
import { api } from "../../utils/api";
import { getToken } from "../../utils/auth";

function UsersList() {
  const [visible, setVisible] = useState<boolean>(false);
  const [updateVisible, setUpdateVisible] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [users, setUsers] = useState<User[]>([]);

  let navigate = useNavigate();

  const fetchUsers = async () => {
    const token = getToken();
    const result: { users: User[] } = await api
      .headers({ Authorization: `Bearer ${token}` })
      .get("/users")
      .json();
    setUsers(result.users);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (user: User) => {
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.username} ?`
      )
    ) {
      window.alert(
        `L'utilisateur ${user.username} a été supprimé avec succès.`
      );
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
            setUpdateVisible(true);
          }}
          icon="pi pi-pencil"
          severity="success"
          text
        />
        <Button
          icon="pi pi-times"
          severity="danger"
          onClick={() => handleDelete(user)}
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

  return (
    <div className="flex flex-col gap-5 py-5 px-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Liste des utilisateurs</h1>
        <Button
          icon="pi pi-plus"
          label="Ajouter un utilisateur"
          onClick={() => setVisible(true)}
          size="small"
        />
        <Dialog
          header="Ajouter un utilisateur"
          visible={visible}
          style={{ width: "60vw" }}
          onHide={() => {
            if (!visible) return;
            setVisible(false);
          }}
        >
          <UserForm
            onSubmit={() => {
              setVisible(false);
              fetchUsers();
            }}
          />
        </Dialog>
        <Dialog
          header="Modifier utilisateur"
          visible={updateVisible}
          style={{ width: "60vw" }}
          onHide={() => {
            if (!updateVisible) return;
            setUpdateVisible(false);
          }}
        >
          <UserForm
            user={selectedUser}
            onSubmit={() => {
              setUpdateVisible(false);
              fetchUsers();
            }}
          />
        </Dialog>
      </div>
      <DataTable value={users}>
        <Column field="username" header="Username" />
        <Column body={getUserEmail} header="Email" />
        <Column field="position" header="Position" />
        <Column body={getUserActions} header="Actions" />
      </DataTable>
      <Link to="/login" className="btn btn-primary">
        Go to Login
      </Link>
    </div>
  );
}
export default UsersList;
