import type { Team } from "../../types/Team";

interface PropsTypes {
  teams: Team[];
}

function ProjectTeams({ teams }: PropsTypes) {
  return (
    <>
      {teams && teams.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Équipes assignées
          </h2>
          <div className="flex flex-wrap gap-2">
            {teams.map((team) => (
              <span
                data-testid="team"
                key={team.slug}
                className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium"
              >
                <i className="pi pi-users mr-2"></i>
                {team.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default ProjectTeams;
