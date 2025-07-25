import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getApi } from "../../utils/api";
import type { Team } from "../../types/team";

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
    <div className="flex justify-center items-center">
      <div className="flex flex-col shadow-2xl p-5 rounded-lg gap-[1rem] mt-9 w-[90%] h-[35rem]">
        <h1 className="text-3xl font-bold mb-12 mt-5">
          Détail de l&apos;équipe
        </h1>
        {team ? (
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-2xl">Nom de l&apos;équipe</span>
              <span className="text-lg font-semibold text-emerald-500 mb-4">
                {team.name}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center text-red-500 font-semibold py-8">
            Équipe inconnue
          </div>
        )}
      </div>
    </div>
  );
}

export default TeamDetail;
