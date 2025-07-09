import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tag } from "primereact/tag";
import { Link, useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import UserForm from "./form";
import type { User } from "../../types/user";
import users from "../../data-test/users";

function UsersList() {
  let navigate = useNavigate();

  const getUserActions = (user: User) => {
    return (
      <>
        <Button
          onClick={() => navigate(`/users/${user.username}`)}
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
        <Button icon="pi pi-times" severity="danger" className="ml-2" text />
      </>
    );
  };

  const getUserTeam = (user: User) => {
    return user.teams.map((team, index) => (
      <Tag
        key={index}
        value={team.name}
        severity="secondary"
        className="mr-2"
      />
    ));
  };

  const getUserEmail = (user: User) => {
    return (
      <div className="flex items-center gap-2">
        <i className="pi pi-envelope" />
        {user.email}
      </div>
    );
  };

  const [visible, setVisible] = useState<boolean>(false);
  const [updateVisible, setUpdateVisible] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
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
          <UserForm onSubmit={() => setVisible(false)} />
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
            onSubmit={() => setUpdateVisible(false)}
          />
        </Dialog>
      </div>
      <DataTable value={users}>
        <Column field="username" header="Username" />
        <Column body={getUserEmail} header="Email" />
        <Column field="position" header="Position" />
        <Column body={getUserTeam} header="Team" />
        <Column body={getUserActions} header="Actions" />
      </DataTable>
      <Link to="/login" className="btn btn-primary">
        Go to Login
      </Link>
    </div>
  );
}
export default UsersList;
