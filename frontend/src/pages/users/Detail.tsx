import { NavLink, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { User } from "../../types/User";
import { getApi } from "../../utils/api";

function UserDetail() {
  const [user, setUser] = useState<User>();

  const { uuid } = useParams();
  async function fetchUser() {
    const result: User = await getApi().get(`/users/${uuid}`).json();
    setUser(result);
  }

  useEffect(() => {
    fetchUser();
  }, [uuid]);

  return (
    <div className="container mx-auto px-6 py-8">
      {user ? (
        <>
          {/* En-tête */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <NavLink
                    to="/users"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <i className="pi pi-arrow-left"></i> Retour aux utilisateurs
                  </NavLink>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {user.username}
                </h1>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 text-sm flex items-center">
                    <i className="pi pi-envelope mr-2"></i>
                    {user.email}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Informations personnelles */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Informations personnelles
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Nom d&apos;utilisateur:</span>
                <span className="font-medium text-gray-900">
                  {user.username}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Email:</span>
                <span className="font-medium text-gray-900">{user.email}</span>
              </div>

              {user.position && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Position:</span>
                  <span className="font-medium text-gray-900">
                    {user.position}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Équipes */}
          {user.teams && user.teams.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Équipes ({user.teams.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.teams.map((team) => (
                  <div
                    key={team.slug}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-blue-100 mr-3">
                        <i className="pi pi-users text-blue-600"></i>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {team.name}
                        </h3>
                        <NavLink
                          to={`/teams/${team.slug}`}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Voir l&apos;équipe →
                        </NavLink>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions rapides */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Actions rapides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NavLink
                to="/teams"
                className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                <i className="pi pi-users text-green-600 text-xl mr-3"></i>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">Équipes</h3>
                  <p className="text-sm text-gray-600">Gérer les équipes</p>
                </div>
              </NavLink>

              <NavLink
                to="/projects"
                className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <i className="pi pi-folder text-blue-600 text-xl mr-3"></i>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">Projets</h3>
                  <p className="text-sm text-gray-600">Voir les projets</p>
                </div>
              </NavLink>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <i className="pi pi-user text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Utilisateur introuvable
          </h3>
          <p className="text-gray-500 mb-6">
            L&apos;utilisateur que vous recherchez n&apos;existe pas ou a été
            supprimé
          </p>
          <NavLink
            to="/users"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="pi pi-arrow-left mr-2"></i>
            Retour aux utilisateurs
          </NavLink>
        </div>
      )}
    </div>
  );
}

export default UserDetail;
