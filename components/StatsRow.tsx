import { overviewStats } from "@/app/lib/deployment-data";

export default function StatsRow() {
  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden border border-line bg-line lg:grid-cols-3">
      {overviewStats.map((stat) => (
        <div
          key={stat.id}
          className="flex flex-1 items-center justify-between px-6 py-4 bg-char"
        >
          <p className="eyebrow">{stat.label}</p>

          <div className="flex items-baseline gap-2">
            <p className="text-lg font-medium text-bone">{stat.value}</p>

            <span
              className={`text-xs font-medium ${
                stat.trend === "up" ? "text-spark" : "text-ash-dim"
              }`}
            >
              {stat.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
