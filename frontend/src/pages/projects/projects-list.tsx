import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Link } from "react-router-dom";

interface Project {
  project: string;
}

function ProjectsList() {
  const projects: Project[] = [
    { project: "Project A" },
    { project: "Project B" },
  ];

  return (
    <div className="flex flex-col gap-5 py-5 px-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Liste des projets</h1>
        <Button
          icon="pi pi-plus"
          label="Ajouter un projet"
          onClick={() => window.alert("Ajouter un projet")}
          size="small"
        />
      </div>
      <DataTable value={projects}>
        <Column field="project" header="Project" />
      </DataTable>
      <Link to="/login" className="btn btn-primary">
        Go to Login
      </Link>
    </div>
  );
}
export default ProjectsList;
