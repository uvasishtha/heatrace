import { stats } from "@/app/lib/dashboard-data";

export default function StatsRow() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="rounded-xl border border-gray-200 bg-white p-5"
        >
          <p className="text-sm text-gray-500">{stat.label}</p>

          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl font-semibold text-gray-900">
              {stat.value}
            </p>

            <span
              className={
                stat.trend === "up"
                  ? "text-xs font-medium text-emerald-600"
                  : "text-xs font-medium text-red-600"
              }
            >
              {stat.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
