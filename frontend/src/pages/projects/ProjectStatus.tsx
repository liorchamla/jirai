function ProjectStatus({ status }: { status: string }) {
  return (
    <span
      data-testid="status"
      className={`px-3 py-1 text-sm rounded-full ${
        status === "active"
          ? "bg-green-100 text-green-800"
          : "bg-gray-100 text-gray-800"
      }`}
    >
      {status === "active" ? "Actif" : "Archivé"}
    </span>
  );
}

export default ProjectStatus;
