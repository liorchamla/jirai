import { NavLink, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getApi } from "../../utils/api";
import type { Team } from "../../types/Team";

interface DetailTeam {
  team?: Team;
}

function TeamDetail() {
  const [team, setTeam] = useState<Team>();

  const { slug } = useParams();
  async function fetchTeam() {
    const result: DetailTeam = await getApi().get(`/teams/${slug}`).json();
    setTeam(result.team);
  }

  useEffect(() => {
    fetchTeam();
  }, [slug]);

  return (
    <div className="container mx-auto px-6 py-8">
      {team ? (
        <>
          {/* En-tête */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <NavLink
                    to="/teams"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <i className="pi pi-arrow-left"></i> Retour aux équipes
                  </NavLink>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {team.name}
                </h1>
                <div className="flex items-center gap-2">
                  {team.creator && (
                    <span className="text-gray-600 text-sm">
                      Créé par {team.creator.username}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Informations de l'équipe */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Informations de l&apos;équipe
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Nom de l&apos;équipe:</span>
                <span className="font-medium text-gray-900">{team.name}</span>
              </div>
              {team.creator && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Créateur:</span>
                  <span className="font-medium text-gray-900">
                    {team.creator.username}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions rapides */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Actions rapides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NavLink
                to="/projects"
                className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <i className="pi pi-folder text-blue-600 text-xl mr-3"></i>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">
                    Voir les projets
                  </h3>
                  <p className="text-sm text-gray-600">
                    Gérer les projets de cette équipe
                  </p>
                </div>
              </NavLink>

              <NavLink
                to="/users"
                className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
              >
                <i className="pi pi-user text-purple-600 text-xl mr-3"></i>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">
                    Gérer les membres
                  </h3>
                  <p className="text-sm text-gray-600">
                    Ajouter ou retirer des membres
                  </p>
                </div>
              </NavLink>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <i className="pi pi-users text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Équipe introuvable
          </h3>
          <p className="text-gray-500 mb-6">
            L&apos;équipe que vous recherchez n&apos;existe pas ou a été
            supprimée
          </p>
          <NavLink
            to="/teams"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="pi pi-arrow-left mr-2"></i>
            Retour aux équipes
          </NavLink>
        </div>
      )}
    </div>
  );
}

export default TeamDetail;
