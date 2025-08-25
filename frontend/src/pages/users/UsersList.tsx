import { Button } from "primereact/button";
import { Link, useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import UserForm from "./Form";
import type { User } from "../../types/User";
import { getApi } from "../../utils/api";
import { Toast } from "primereact/toast";
import { AuthContext } from "../../utils/auth";

function UsersList() {
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);
  const [dialog, setDialog] = useState<"add" | "update" | "delete" | null>(
    null
  );

  const { userInfo } = useContext(AuthContext);

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
      await getApi().delete(`/users/${user.uuid}`).res();
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

  // Calculer les statistiques
  const totalUsers = users.length;
  const activeUsers = users.filter(
    (user) => user.teams && user.teams.length > 0
  ).length;
  const totalTeams = users.reduce(
    (acc, user) => acc + (user.teams?.length || 0),
    0
  );

  return (
    <div className="container mx-auto px-6 py-8">
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Gestion des utilisateurs
            </h1>
            <p className="text-gray-600">Gérez et organisez les utilisateurs</p>
          </div>
          <Button
            icon="pi pi-plus"
            label="Nouvel utilisateur"
            onClick={() => setDialog("add")}
            className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
          />
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <i className="pi pi-user text-purple-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total utilisateurs
              </p>
              <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <i className="pi pi-users text-green-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Avec équipes</p>
              <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <i className="pi pi-users text-blue-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Équipes liées</p>
              <p className="text-2xl font-bold text-gray-900">{totalTeams}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 mr-4">
              <i className="pi pi-check-circle text-orange-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Utilisateurs actifs
              </p>
              <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des utilisateurs */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Tous les utilisateurs
          </h2>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <i className="pi pi-spin pi-spinner text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-500">Chargement des utilisateurs...</p>
            </div>
          ) : users.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <div
                  key={user.uuid}
                  className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200 flex flex-col h-full"
                >
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <Link
                          to={`/users/${user.uuid}`}
                          className="text-lg font-semibold text-gray-900 hover:text-blue-600 hover:underline"
                        >
                          {user.username}
                        </Link>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                          <i className="pi pi-envelope"></i>
                          {user.email}
                        </div>
                      </div>
                      {userInfo?.uuid === user.uuid && (
                        <div className="flex space-x-1">
                          <Button
                            onClick={() => {
                              setSelectedUser(user);
                              setDialog("update");
                            }}
                            icon="pi pi-pencil"
                            severity="success"
                            text
                            size="small"
                            tooltip="Modifier"
                          />
                          <Button
                            icon="pi pi-times"
                            severity="danger"
                            onClick={() => handleDelete(user)}
                            text
                            size="small"
                            tooltip="Supprimer"
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 flex-grow">
                      {user.position && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Position:</span>
                          <span className="font-medium">{user.position}</span>
                        </div>
                      )}

                      {user.teams && user.teams.length > 0 ? (
                        <div>
                          <p className="text-sm text-gray-500 mb-2">
                            {user.teams.length === 1 ? "Équipe:" : "Équipes:"}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {user.teams.map((team) => (
                              <span
                                key={team.slug}
                                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                              >
                                {team.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">
                          Aucune équipe
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-gray-200 mt-auto">
                      <Button
                        onClick={() => navigate(`/users/${user.uuid}`)}
                        icon="pi pi-arrow-right"
                        label="Voir l'utilisateur"
                        text
                        className="w-full justify-center"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <i className="pi pi-user text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun utilisateur trouvé
              </h3>
              <p className="text-gray-500 mb-6">
                Commencez par créer votre premier utilisateur
              </p>
              <Button
                icon="pi pi-plus"
                label="Créer un utilisateur"
                onClick={() => setDialog("add")}
                className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
              />
            </div>
          )}
        </div>
      </div>

      {/* Actions rapides */}
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Actions rapides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setDialog("add")}
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              <i className="pi pi-plus-circle text-purple-600 text-xl mr-3"></i>
              <div className="text-left">
                <h3 className="font-medium text-gray-900">
                  Nouvel utilisateur
                </h3>
                <p className="text-sm text-gray-600">Ajouter un utilisateur</p>
              </div>
            </button>

            <Link
              to="/teams"
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <i className="pi pi-users text-green-600 text-xl mr-3"></i>
              <div className="text-left">
                <h3 className="font-medium text-gray-900">Équipes</h3>
                <p className="text-sm text-gray-600">Gérer les équipes</p>
              </div>
            </Link>

            <Link
              to="/projects"
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <i className="pi pi-folder text-blue-600 text-xl mr-3"></i>
              <div className="text-left">
                <h3 className="font-medium text-gray-900">Projets</h3>
                <p className="text-sm text-gray-600">Voir les projets</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
      {/* Dialogs */}
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
          onCancel={() => setDialog(null)}
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
          <h2 className="text-lg font-semibold mb-4 text-center">
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
            <Button label="Annuler" onClick={() => setDialog(null)} />
          </div>
        </div>
      </Dialog>

      <Toast ref={toast} position="top-right" />
    </div>
  );
}

export default UsersList;
