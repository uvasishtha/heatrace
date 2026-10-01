import Link from "next/link";
import {
  getUsageDetail,
  teams,
} from "@/app/lib/dashboard-data";

type UsagePageProps = {
  searchParams: Promise<{
    team?: string;
    day?: string;
  }>;
};

export default async function UsagePage({
  searchParams,
}: UsagePageProps) {
  const params = await searchParams;

  const teamId = params.team;
  const day = params.day;

  const usage =
    teamId && day ? getUsageDetail(teamId, day) : null;

  const team = teams.find((team) => team.id === teamId);

  if (!usage || !team) {
    return (
      <main className="min-h-screen bg-char p-6 text-bone">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/"
            className="text-sm text-ash-dim hover:text-bone"
          >
            ← Back to dashboard
          </Link>

          <div className="mt-12 border border-line p-8">
            <p className="eyebrow">Usage</p>
            <h1 className="mt-2 font-serif text-3xl italic">
              Usage data not found
            </h1>
            <p className="mt-3 text-sm text-ash-dim">
              Select a cell from the dashboard heatmap to view its details.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const formattedDate = new Date(`${day}T00:00:00`).toLocaleDateString(
    undefined,
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  );

  return (
    <main className="min-h-screen bg-char p-6 text-bone">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="text-sm text-ash-dim transition-colors hover:text-bone"
        >
          ← Back to dashboard
        </Link>

        <div className="mt-8">
          <p className="eyebrow">Usage drill-down</p>

          <div className="mt-2 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <h1 className="font-serif text-4xl italic">
                {team.name}
              </h1>

              <p className="mt-2 text-sm text-ash-dim">
                AI activity on {formattedDate}
              </p>
            </div>

            <div className="text-sm text-ash-dim">
              <span className="text-bone">
                {usage.change >= 0 ? "+" : ""}
                {usage.change}%
              </span>{" "}
              vs. previous period
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-px border border-line bg-line md:grid-cols-3">
          <div className="bg-char p-6">
            <p className="eyebrow">AI Interactions</p>
            <p className="mt-3 text-3xl text-bone">
              {usage.interactions.toLocaleString()}
            </p>
          </div>

          <div className="bg-char p-6">
            <p className="eyebrow">Estimated Spend</p>
            <p className="mt-3 text-3xl text-bone">
              ${usage.estimatedSpend.toFixed(2)}
            </p>
          </div>

          <div className="bg-char p-6">
            <p className="eyebrow">Change</p>
            <p className="mt-3 text-3xl text-bone">
              {usage.change >= 0 ? "+" : ""}
              {usage.change}%
            </p>
          </div>
        </div>

        <div className="mt-6 border border-line bg-char p-6">
          <p className="eyebrow">AI Tools</p>

          <div className="mt-6 space-y-5">
            {usage.tools.map((tool) => (
              <div key={tool.name}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-ash">{tool.name}</span>
                  <span className="text-bone">
                    {tool.percentage}%
                  </span>
                </div>

                <div className="h-2 bg-char-2">
                  <div
                    className="h-full bg-spark"
                    style={{
                      width: `${tool.percentage}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 border border-line bg-char p-6">
          <p className="eyebrow">What changed</p>

          <div className="mt-5 space-y-4">
            {usage.change >= 30 && (
              <div className="border-l-2 border-spark pl-4">
                <p className="text-sm text-bone">
                  Usage increased significantly
                </p>
                <p className="mt-1 text-xs text-ash-dim">
                  AI activity is up {usage.change}% compared with the
                  previous period.
                </p>
              </div>
            )}

            {usage.estimatedSpend > 30 && (
              <div className="border-l-2 border-ember pl-4">
                <p className="text-sm text-bone">
                  Spending is elevated
                </p>
                <p className="mt-1 text-xs text-ash-dim">
                  Estimated usage cost reached $
                  {usage.estimatedSpend.toFixed(2)}.
                </p>
              </div>
            )}

            <div className="border-l-2 border-crimson pl-4">
              <p className="text-sm text-bone">
                {usage.tools[0].name} is the dominant tool
              </p>
              <p className="mt-1 text-xs text-ash-dim">
                It represents {usage.tools[0].percentage}% of this
                team&rsquo;s AI activity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}