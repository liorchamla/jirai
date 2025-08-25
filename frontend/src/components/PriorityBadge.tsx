function PriorityBadge({ priority }: { priority: string }) {
  const getBadgeClass = () => {
    switch (priority) {
      case "frozen":
        return "bg-blue-500";
      case "low":
        return "bg-green-700";
      case "medium":
        return "bg-orange-300";
      case "high":
        return "bg-red-700";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <span className={`p-1 text-white rounded w-fit ${getBadgeClass()}`}>
      {priority === "frozen"
        ? "Gelée"
        : priority === "low"
          ? "Basse"
          : priority === "medium"
            ? "Moyenne"
            : priority === "high"
              ? "Haute"
              : priority}
    </span>
  );
}

export default PriorityBadge;
