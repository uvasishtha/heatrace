import { Fragment } from "react";
import { days, heatmapData, teams } from "@/app/lib/dashboard-data";

function intensityClass(value: number) {
  if (value >= 80) return "bg-spark shadow-[0_0_10px_-1px_var(--color-spark)]";
  if (value >= 60) return "bg-ember";
  if (value >= 40) return "bg-burnt";
  if (value >= 20) return "bg-crimson";
  return "bg-char-2";
}

export default function UsageHeatmap() {
  return (
    <section className="border border-line bg-char p-6 lg:col-span-2">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="eyebrow">Fourteen-day view</p>
          <h2 className="mt-1 font-serif text-2xl italic text-bone">
            AI Usage
          </h2>
        </div>
        <p className="max-w-[16rem] text-right text-xs text-ash-dim">
          How hard each team is running AI, day by day.
        </p>
      </div>

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
                className="text-center text-[10px] text-ash-dim"
              >
                {new Date(day).toLocaleDateString(undefined, {
                  month: "numeric",
                  day: "numeric",
                })}
              </div>
            ))}

            {teams.map((team) => (
              <Fragment key={team.id}>
                <div className="flex items-center text-sm text-ash">
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
                      className={`h-6 w-6 ${intensityClass(cell?.value ?? 0)}`}
                    />
                  );
                })}
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-xs text-ash-dim">
        <span>Cold</span>
        <div className="h-3 w-3 bg-char-2" />
        <div className="h-3 w-3 bg-crimson" />
        <div className="h-3 w-3 bg-burnt" />
        <div className="h-3 w-3 bg-ember" />
        <div className="h-3 w-3 bg-spark" />
        <span>Hot</span>
      </div>
    </section>
  );
}
