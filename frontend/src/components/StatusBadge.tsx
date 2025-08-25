import { Tooltip } from "primereact/tooltip";

function StatusBadge({ name }: { name: string }) {
  const getIcon = () => {
    switch (name) {
      case "thinking":
        return "pi pi-minus-circle text-gray-500";
      case "ready":
        return "pi pi-circle text-blue-500";
      case "in_progress":
        return "pi pi-play-circle text-yellow-500";
      case "done":
        return "pi pi-chevron-circle-down text-green-500";
      case "canceled":
        return "pi pi-times-circle text-red-500";
      default:
        return "pi pi-question-circle";
    }
  };

  const getStatusLabel = () => {
    switch (name) {
      case "thinking":
        return "En réflexion";
      case "ready":
        return "Prêt";
      case "in_progress":
        return "En cours";
      case "done":
        return "Terminé";
      case "canceled":
        return "Annulé";
      default:
        return "Statut inconnu";
    }
  };

  return (
    <>
      <span data-pr-tooltip={getStatusLabel()} data-pr-position="top">
        {getIcon() && <i className={`${getIcon()} mr-1`} />}
      </span>
      <Tooltip target="[data-pr-tooltip]" />
    </>
  );
}

export default StatusBadge;
