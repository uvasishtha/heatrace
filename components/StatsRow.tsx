import { stats } from "@/app/lib/dashboard-data";

export default function StatsRow() {
  const [hero, ...rest] = stats;

  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden border border-line bg-line lg:grid-cols-3">
      <div className="relative bg-char-2 p-6 lg:col-span-2">
        <div className="absolute left-0 top-0 h-full w-[3px] bg-ember" />

        <p className="eyebrow">{hero.label}</p>

        <div className="mt-3 flex items-baseline gap-3">
          <p className="font-serif text-6xl italic text-bone">{hero.value}</p>

          <span
            className={`text-sm font-medium ${
              hero.trend === "up" ? "text-spark" : "text-ash"
            }`}
          >
            {hero.change}
          </span>
        </div>
      </div>

      <div className="flex flex-col divide-y divide-line bg-char">
        {rest.map((stat) => (
          <div
            key={stat.id}
            className="flex flex-1 items-center justify-between px-6 py-4"
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
    </div>
  );
}
