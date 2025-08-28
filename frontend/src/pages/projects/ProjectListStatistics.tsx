import type { Project } from "../../types/Project";

interface ProjectListStatisticsProps {
  projects: Project[];
}

function ProjectListStatistics({ projects }: ProjectListStatisticsProps) {
  const activeProjects = projects.filter((p) => p.status === "active").length;
  const totalEpics = projects.reduce(
    (acc, project) => acc + (project.epics?.length || 0),
    0
  );
  const totalTeams = projects.reduce(
    (acc, project) => acc + (project.teams?.length || 0),
    0
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 mr-4">
            <i className="pi pi-folder text-blue-600 text-xl"></i>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total projets</p>
            <p
              data-testid="total-projects"
              className="text-2xl font-bold text-gray-900"
            >
              {projects.length}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 mr-4">
            <i className="pi pi-check-circle text-green-600 text-xl"></i>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Projets actifs</p>
            <p
              data-testid="active-projects"
              className="text-2xl font-bold text-gray-900"
            >
              {activeProjects}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100 mr-4">
            <i className="pi pi-bookmark text-purple-600 text-xl"></i>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total EPIC</p>
            <p
              data-testid="total-epics"
              className="text-2xl font-bold text-gray-900"
            >
              {totalEpics}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-orange-100 mr-4">
            <i className="pi pi-users text-orange-600 text-xl"></i>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Équipes liées</p>
            <p
              data-testid="total-teams"
              className="text-2xl font-bold text-gray-900"
            >
              {totalTeams}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectListStatistics;
