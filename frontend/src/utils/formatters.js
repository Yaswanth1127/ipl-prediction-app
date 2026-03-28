const APP_TIME_ZONE = "Asia/Kolkata";

export const formatDateTime = (value) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: APP_TIME_ZONE,
  }).format(new Date(value));

export const formatDateTimeLocalValue = (value) => {
  if (!value) {
    return "";
  }

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: APP_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    hourCycle: "h23",
  }).formatToParts(new Date(value));

  const partMap = Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));

  return `${partMap.year}-${partMap.month}-${partMap.day}T${partMap.hour}:${partMap.minute}`;
};

export const parseIstDateTimeLocalValue = (value) => {
  if (!value) {
    return "";
  }

  const [datePart, timePart] = value.split("T");

  if (!datePart || !timePart) {
    return "";
  }

  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  const utcTime = Date.UTC(year, month - 1, day, hour, minute) - 330 * 60 * 1000;

  return new Date(utcTime).toISOString();
};

export const getDateKeyInIst = (value) => formatDateTimeLocalValue(value).slice(0, 10);

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
