import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Link, useNavigate } from "react-router-dom";
import { getApi } from "../../utils/api";
import type { Team } from "../../types/team";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import TeamForm from "./form";
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

  const getTeamActions = (team: Team) => {
    return (
      <>
        <Button
          onClick={() => navigate(`/teams/${team.slug}`)}
          icon="pi pi-eye"
          severity="info"
          text
        />
        {team.creator.uuid === userInfo?.uuid && (
          <>
            <Button
              onClick={() => {
                setSelectedTeam(team);
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
                handleDelete(team);
              }}
              className="ml-2"
              text
            />
          </>
        )}
      </>
    );
  };

  return (
    <div className="flex flex-col gap-5 py-5 px-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Liste des équipes</h1>
        <Button
          icon="pi pi-plus"
          label="Ajouter une équipe"
          size="small"
          onClick={() => setDialog("add")}
        />
      </div>
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
          <h2 className="text-lg font-semibold mb-4">
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
            <Button
              label="Annuler"
              className="mt-2"
              onClick={() => setDialog(null)}
            />
          </div>
        </div>
      </Dialog>
      <DataTable value={teams}>
        <Column field="name" header="Team" />
        <Column body={getTeamActions} header="Actions" />
      </DataTable>
      <Link to="/login" className="btn btn-primary">
        Go to Login
      </Link>
      <Toast ref={toast} position="top-right" />
    </div>
  );
}

export default TeamsList;
