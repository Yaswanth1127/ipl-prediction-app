export const formatDateTime = (value) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export const getCountdownLabel = (deadline) => {
  const diff = new Date(deadline).getTime() - Date.now();

  if (diff <= 0) {
    return "Prediction locked";
  }

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h left`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m left`;
  }

  return `${minutes}m left`;
};
