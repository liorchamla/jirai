import type { Project } from "../../types/Project";

interface PropsTypes {
  project: Project;
}

function ProjectStatistics({ project }: PropsTypes) {
  const totalEpics = project?.epics?.length || 0;
  const totalTickets =
    project?.epics?.reduce(
      (acc, epic) => acc + (epic.tickets?.length || 0),
      0
    ) || 0;
  const totalComments =
    project?.epics?.reduce(
      (acc, epic) => acc + (epic.comments?.length || 0),
      0
    ) || 0;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100 mr-4">
            <i className="pi pi-bookmark text-purple-600 text-xl"></i>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">EPIC</p>
            <p
              data-testid="epic-count"
              className="text-2xl font-bold text-gray-900"
            >
              {totalEpics}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 mr-4">
            <i className="pi pi-ticket text-blue-600 text-xl"></i>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">TICKET</p>
            <p
              data-testid="ticket-count"
              className="text-2xl font-bold text-gray-900"
            >
              {totalTickets}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 mr-4">
            <i className="pi pi-comment text-green-600 text-xl"></i>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Commentaires</p>
            <p
              data-testid="comment-count"
              className="text-2xl font-bold text-gray-900"
            >
              {totalComments}
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
            <p className="text-sm font-medium text-gray-600">Équipes</p>
            <p
              data-testid="team-count"
              className="text-2xl font-bold text-gray-900"
            >
              {project.teams?.length || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProjectStatistics;
