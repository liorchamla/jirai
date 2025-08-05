import { useParams } from "react-router-dom";
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
    <div className="flex justify-center items-center">
      <div className="flex flex-col shadow-2xl p-5 rounded-lg gap-[1rem] mt-9 w-[90%] mb-18">
        <h1 className="text-3xl font-bold mb-12 mt-5">
          Détail de l&apos;utilisateur
        </h1>
        {user ? (
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-2xl">Nom d&apos;utilisateur</span>
              <span className="text-lg font-semibold text-emerald-500 mb-4">
                {user.username}
              </span>
            </div>
            {user.email && (
              <div className="flex flex-col">
                <span className="text-2xl">Email</span>
                <span className="text-lg font-medium text-gray-500 mb-4">
                  {user.email}
                </span>
              </div>
            )}
            {user.position && (
              <div className="flex flex-col">
                <span className="text-2xl">Position</span>
                <span className="text-lg font-medium text-gray-500 mb-4">
                  {user.position}
                </span>
              </div>
            )}
            {user.teams && user.teams.length > 0 && (
              <div className="flex flex-col">
                <span className="text-2xl">Équipes</span>
                <div className="mb-4 mt-3">
                  {user.teams.map((team, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2"
                    >
                      {team.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-red-500 font-semibold py-8">
            Utilisateur inconnu
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDetail;
