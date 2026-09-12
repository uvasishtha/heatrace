import { Fragment } from "react";
import { days, heatmapData, teams } from "@/app/lib/dashboard-data";

function intensityClass(value: number) {
  if (value >= 80) return "bg-orange-600";
  if (value >= 60) return "bg-orange-400";
  if (value >= 40) return "bg-orange-300";
  if (value >= 20) return "bg-orange-200";
  return "bg-orange-100";
}

export default function UsageHeatmap() {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 lg:col-span-2">
      <h2 className="text-lg font-medium text-gray-900">AI Usage</h2>

      <p className="mt-1 text-sm text-gray-500">
        Understand how your teams are using AI.
      </p>

      <div className="mt-6 overflow-x-auto">
        <div className="min-w-max">
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: `96px repeat(${days.length}, 1fr)`,
            }}
          >
            <div />
            {days.map((day) => (
              <div
                key={day}
                className="text-center text-[10px] text-gray-400"
              >
                {new Date(day).toLocaleDateString(undefined, {
                  month: "numeric",
                  day: "numeric",
                })}
              </div>
            ))}

            {teams.map((team) => (
              <Fragment key={team.id}>
                <div className="flex items-center text-sm text-gray-600">
                  {team.name}
                </div>

                {days.map((day) => {
                  const cell = heatmapData.find(
                    (c) => c.teamId === team.id && c.day === day,
                  );

                  return (
                    <div
                      key={`${team.id}-${day}`}
                      title={`${team.name} · ${day} · ${cell?.value ?? 0}`}
                      className={`h-6 w-6 rounded ${intensityClass(cell?.value ?? 0)}`}
                    />
                  );
                })}
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
        <span>Less</span>
        <div className="h-3 w-3 rounded bg-orange-100" />
        <div className="h-3 w-3 rounded bg-orange-200" />
        <div className="h-3 w-3 rounded bg-orange-300" />
        <div className="h-3 w-3 rounded bg-orange-400" />
        <div className="h-3 w-3 rounded bg-orange-600" />
        <span>More</span>
      </div>
    </section>
  );
}
