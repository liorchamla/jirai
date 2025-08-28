import { Button } from "primereact/button";
import { Link, useNavigate } from "react-router-dom";
import { getApi } from "../../utils/api";
import type { Team } from "../../types/Team";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import TeamForm from "./Form";
import { Toast } from "primereact/toast";
import { AuthContext } from "../../utils/auth";

function TeamsList() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [dialog, setDialog] = useState<"add" | "update" | "delete" | null>(
    null
  );
  const [selectedTeam, setSelectedTeam] = useState<Team | undefined>(undefined);

  const { userInfo } = useContext(AuthContext);

  const toast = useRef<Toast>(null);

  const navigate = useNavigate();

  const fetchTeams = useCallback(async () => {
    const result: { teams: Team[] } = await getApi().get("/teams").json();
    setTeams(result.teams);
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const handleDelete = (team: Team) => {
    setSelectedTeam(team);
    setDialog("delete");
  };

  const handleConfirmDelete = async (team: Team) => {
    try {
      await getApi().delete(`/teams/${team.slug}`).res();
      setDialog(null);
      fetchTeams(); // Rafraîchir la liste
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Équipe supprimée avec succès",
        life: 3000,
      });
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Une erreur s'est produite lors de la suppression de l'équipe",
      });
    }
  };

  // Calculer les statistiques - en utilisant des valeurs par défaut car l'API pourrait ne pas retourner ces données
  const totalUsers = 0; // Nous n'avons pas cette information dans le type Team actuel
  const totalProjects = 0; // Nous n'avons pas cette information dans le type Team actuel

  return (
    <div className="container mx-auto px-6 py-8">
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Gestion des équipes
            </h1>
            <p className="text-gray-600">Gérez et organisez vos équipes</p>
          </div>
          <Button
            icon="pi pi-plus"
            label="Nouvelle équipe"
            onClick={() => setDialog("add")}
            className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
          />
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <i className="pi pi-users text-green-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total équipes</p>
              <p className="text-2xl font-bold text-gray-900">{teams.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <i className="pi pi-user text-blue-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Utilisateurs</p>
              <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <i className="pi pi-folder text-purple-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Projets liés</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalProjects}
              </p>
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
                Équipes actives
              </p>
              <p className="text-2xl font-bold text-gray-900">{teams.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des équipes */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Toutes les équipes
          </h2>
        </div>
        <div className="p-6">
          {teams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => (
                <div
                  key={team.slug}
                  className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200 flex flex-col h-full"
                >
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <Link
                          to={`/teams/${team.slug}`}
                          className="text-lg font-semibold text-gray-900 hover:text-blue-600 hover:underline"
                        >
                          {team.name}
                        </Link>
                      </div>
                      {team.creator?.uuid === userInfo?.uuid && (
                        <div className="flex space-x-1">
                          <Button
                            onClick={() => {
                              setSelectedTeam(team);
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
                            onClick={() => handleDelete(team)}
                            text
                            size="small"
                            tooltip="Supprimer"
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 flex-grow">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Créateur:</span>
                        <span className="font-medium">
                          {team.creator?.username}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-200 mt-auto">
                      <Button
                        onClick={() => navigate(`/teams/${team.slug}`)}
                        icon="pi pi-arrow-right"
                        label="Voir l'équipe"
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
              <i className="pi pi-users text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune équipe trouvée
              </h3>
              <p className="text-gray-500 mb-6">
                Commencez par créer votre première équipe
              </p>
              <Button
                icon="pi pi-plus"
                label="Créer une équipe"
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
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <i className="pi pi-plus-circle text-green-600 text-xl mr-3"></i>
              <div className="text-left">
                <h3 className="font-medium text-gray-900">Nouvelle équipe</h3>
                <p className="text-sm text-gray-600">
                  Créer une nouvelle équipe
                </p>
              </div>
            </button>

            <Link
              to="/projects"
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <i className="pi pi-folder text-blue-600 text-xl mr-3"></i>
              <div className="text-left">
                <h3 className="font-medium text-gray-900">Projets</h3>
                <p className="text-sm text-gray-600">Gérer les projets</p>
              </div>
            </Link>

            <Link
              to="/users"
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              <i className="pi pi-user text-purple-600 text-xl mr-3"></i>
              <div className="text-left">
                <h3 className="font-medium text-gray-900">Utilisateurs</h3>
                <p className="text-sm text-gray-600">Gérer les utilisateurs</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
      {/* Dialogs */}
      <Dialog
        header="Ajouter une équipe"
        visible={dialog === "add"}
        style={{ width: "60vw" }}
        onHide={() => {
          setDialog(null);
        }}
      >
        <TeamForm
          onSubmit={() => {
            setDialog(null);
            fetchTeams();
          }}
          onCancel={() => setDialog(null)}
        />
      </Dialog>

      <Dialog
        header="Modifier l'équipe"
        visible={dialog === "update"}
        style={{ width: "60vw" }}
        onHide={() => setDialog(null)}
      >
        <TeamForm
          team={selectedTeam}
          onSubmit={() => {
            setDialog(null);
            fetchTeams();
          }}
        />
      </Dialog>

      <Dialog
        header="Supprimer équipe"
        visible={dialog === "delete"}
        style={{ width: "30vw" }}
        onHide={() => {
          setDialog(null);
        }}
      >
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4 text-center">
            Êtes-vous sûr de vouloir supprimer cette équipe &quot;
            {selectedTeam?.name}&quot; ?
          </h2>
          <div className="flex gap-2">
            <Button
              label="Confirmer"
              severity="danger"
              onClick={() => {
                if (selectedTeam) {
                  handleConfirmDelete(selectedTeam);
                }
              }}
            />
            <Button label="Annuler" onClick={() => setDialog(null)} />
          </div>
        </div>
      </Dialog>

      <Toast ref={toast} position="top-right" />
    </div>
  );
}

export default TeamsList;
