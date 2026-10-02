export function timeAgo(iso: string): string {
  const seconds = Math.round((Date.now() - Date.parse(iso)) / 1000);

  if (seconds < 60) return "just now";

  const units: [label: string, seconds: number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];

  for (const [label, size] of units) {
    const amount = Math.floor(seconds / size);
    if (amount >= 1) {
      return `${amount} ${label}${amount === 1 ? "" : "s"} ago`;
    }
  }

  return "just now";
}