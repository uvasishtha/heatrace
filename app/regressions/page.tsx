import Link from "next/link";
import Navigation from "@/components/Navigation";
import { regressions, services } from "@/app/lib/deployment-data";
import { timeAgo } from "@/app/lib/format";

const DOT_STYLES = {
  critical: "bg-crimson",
  degraded: "bg-ember",
  healthy: "bg-spark",
} as const;

const METRIC_LABELS = {
  "error-rate": "Error rate",
  "p95-latency": "p95 latency",
  "http-5xx": "HTTP 5xx",
  throughput: "Throughput",
} as const;

const SEVERITY_STYLES = {
  low: "text-ash-dim",
  medium: "text-burnt",
  high: "text-ember",
  critical: "text-crimson",
} as const;

export default async function RegressionsPage({
  searchParams,
}: {
  searchParams: Promise<{ deployment?: string }>;
}) {
  const { deployment } = await searchParams;
  const highlighted = deployment ? Number(deployment) : null;

  const byService = services.map((service) => {
    const items = regressions
      .filter((r) => r.service === service.id && r.status !== "false-positive")
      .sort((a, b) => Date.parse(b.detectedAt) - Date.parse(a.detectedAt));

    const byDeployment = new Map<number, typeof items>();
    for (const item of items) {
      const existing = byDeployment.get(item.deploymentId);
      if (existing) existing.push(item);
      else byDeployment.set(item.deploymentId, [item]);
    }

    return { service, deployments: [...byDeployment.values()] };
  });

  const affected = byService.filter((g) => g.deployments.length > 0);
  const clean = byService.filter((g) => g.deployments.length === 0);
  const openCount = regressions.filter((r) => r.status !== "false-positive").length;

  return (
    <>
      <Navigation />
      <main className="min-h-screen p-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Production health</p>
              <h1 className="mt-1 font-serif text-4xl italic text-bone">
                Regressions
              </h1>
            </div>
            <p className="text-sm text-ash-dim">
              {openCount} open across {services.length} services
            </p>
          </div>

          <div className="heat-rule mt-6" />

          <div className="mt-8 space-y-3">
            {affected.map(({ service, deployments: serviceDeployments }) => (
              <section
                key={service.id}
                className="border border-line bg-char p-5 transition-colors hover:border-line-bright"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${DOT_STYLES[service.recentHealth]}`}
                  />
                  <Link
                    href={`/services/${service.id}`}
                    className="text-sm font-medium text-bone hover:text-spark"
                  >
                    {service.name}
                  </Link>
                  <span className="ml-auto text-xs text-ash-dim">
                    {serviceDeployments.length === 1
                      ? "1 deployment"
                      : `${serviceDeployments.length} deployments`}
                  </span>
                </div>

                <ul className="mt-4 divide-y divide-line border-t border-line">
                  {serviceDeployments.map((items) => {
                    const deploymentId = items[0].deploymentId;
                    const detectedAt = items.reduce((latest, r) =>
                      Date.parse(r.detectedAt) > Date.parse(latest) ? r.detectedAt : latest
                    , items[0].detectedAt);

                    return (
                      <li key={deploymentId}>
                        <Link
                          href={`/deployments/${deploymentId}`}
                          className={`flex items-start gap-4 py-3 pl-4 transition-colors hover:bg-char-2 ${
                            highlighted === deploymentId
                              ? "bg-char-2 outline outline-1 -outline-offset-1 outline-ember/40"
                              : ""
                          }`}
                        >
                          <span className="w-20 shrink-0 pt-0.5 text-xs text-ash-dim">
                            Deploy #{deploymentId}
                          </span>

                          <span className="min-w-0 flex-1 space-y-1">
                            {items.map((r) => (
                              <span
                                key={r.id}
                                className="flex items-baseline gap-2 text-sm"
                              >
                                <span className="text-ash">
                                  {METRIC_LABELS[r.detectedMetric]}
                                </span>
                                <span className="font-medium text-crimson">
                                  ↑ {r.percentageChange}%
                                </span>
                                <span
                                  className={`text-[10px] uppercase tracking-wider ${SEVERITY_STYLES[r.severity]}`}
                                >
                                  {r.severity}
                                </span>
                              </span>
                            ))}
                          </span>

                          <span className="shrink-0 pt-0.5 text-xs text-ash-dim">
                            {timeAgo(detectedAt)}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}

            {clean.map(({ service }) => (
              <section
                key={service.id}
                className="flex items-center gap-3 border border-line bg-char p-5"
              >
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${DOT_STYLES[service.recentHealth]}`}
                />
                <Link
                  href={`/services/${service.id}`}
                  className="text-sm font-medium text-bone hover:text-spark"
                >
                  {service.name}
                </Link>
                <span className="ml-auto text-xs text-spark">
                  No recent regressions
                </span>
              </section>
            ))}
          </div>

          {clean.length > 0 && affected.length > 0 && (
            <p className="mt-8 text-xs text-ash-dim">
              {affected.length} of {services.length} services affected.
            </p>
          )}
        </div>
      </main>
    </>
  );
}