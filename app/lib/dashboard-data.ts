export type Team = {
  id: string;
  name: string;
};

export type HeatmapCell = {
  teamId: string;
  day: string;
  value: number;
};

export type Signal = {
  id: string;
  title: string;
  description: string;
  severity: "info" | "warning" | "critical";
};

export type Stat = {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
};

export const teams: Team[] = [
  { id: "engineering", name: "Engineering" },
  { id: "design", name: "Design" },
  { id: "sales", name: "Sales" },
  { id: "marketing", name: "Marketing" },
  { id: "support", name: "Support" },
  { id: "data", name: "Data" },
];

export const days = Array.from({ length: 14 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (13 - i));
  return date.toISOString().slice(0, 10);
});

// Deterministic pseudo-random generator so the simulated heatmap
// renders the same values on every request.
function mulberry32(seed: number) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const heatmapData: HeatmapCell[] = (() => {
  const random = mulberry32(42);
  return teams.flatMap((team) =>
    days.map((day) => ({
      teamId: team.id,
      day,
      value: Math.round(random() * 100),
    })),
  );
})();

export const stats: Stat[] = [
  {
    id: "active-users",
    label: "Active Users",
    value: "482",
    change: "+8.2%",
    trend: "up",
  },
  {
    id: "prompts-sent",
    label: "Prompts Sent",
    value: "38.6k",
    change: "+21.4%",
    trend: "up",
  },
  {
    id: "est-spend",
    label: "Est. Monthly Spend",
    value: "$12,340",
    change: "+11.9%",
    trend: "up",
  },
  {
    id: "wow-growth",
    label: "Week-over-Week Growth",
    value: "14.3%",
    change: "-2.1%",
    trend: "down",
  },
];

export const signals: Signal[] = [
  {
    id: "support-spike",
    title: "Prompt volume spiking in Support",
    description: "Up 64% vs. last week, driven by a new ticket-triage workflow.",
    severity: "warning",
  },
  {
    id: "budget-threshold",
    title: "Spend approaching monthly threshold",
    description: "Org-wide spend is at 82% of the monthly budget with 9 days left.",
    severity: "critical",
  },
  {
    id: "new-tool",
    title: "New tool adopted in Engineering",
    description: "Claude Code usage grew from 3 to 41 active users this month.",
    severity: "info",
  },
  {
    id: "marketing-decline",
    title: "Marketing usage declined",
    description: "Prompt activity is down 18% compared to the prior 30 days.",
    severity: "info",
  },
];
