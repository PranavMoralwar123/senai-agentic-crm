export function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export function formatRelative(value) {
  if (!value) return "—";
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(value);
}

export function truncate(text, max = 80) {
  if (!text) return "—";
  return text.length > max ? `${text.slice(0, max)}…` : text;
}
