import Link from "next/link";
import Navigation from "@/components/Navigation";
import { getServiceById, deployments, regressions } from "@/app/lib/deployment-data";

export default async function ServiceDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ day?: string }>;
}) {
  const { id } = await params;
  const { day } = await searchParams;
  const service = getServiceById(id);

  if (!service) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen p-8">
          <div className="mx-auto max-w-7xl">
            <Link
              href="/services"
              className="text-sm text-ash-dim hover:text-bone"
            >
              ← Back to services
            </Link>
            <div className="mt-12 border border-line p-8 text-center">
              <p className="eyebrow">Not Found</p>
              <h1 className="mt-2 font-serif text-3xl italic text-bone">
                Service not found
              </h1>
            </div>
          </div>
        </main>
      </>
    );
  }

  const serviceDeployments = deployments
    .filter((d) => d.service === service.id)
    .sort((a, b) => Date.parse(b.deployedAt) - Date.parse(a.deployedAt))
    .slice(0, 10);

  const serviceRegressions = regressions
    .filter((r) => r.service === service.id)
    .sort((a, b) => Date.parse(b.detectedAt) - Date.parse(a.detectedAt));

  const stats = [
    { label: "Deployments", value: service.deploymentCount.toString() },
    {
      label: "Regressions",
      value: service.regressionCount.toString(),
      accent: service.regressionCount > 0,
    },
    { label: "Error Rate", value: `${service.errorRate.toFixed(1)}%` },
    { label: "P95 Latency", value: `${service.p95Latency}ms` },
  ];

  return (
    <>
      <Navigation />
      <main className="min-h-screen p-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/services"
            className="text-sm text-ash-dim hover:text-bone"
          >
            ← Back to services
          </Link>

          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Service</p>
              <h1 className="mt-1 font-serif text-4xl italic text-bone">
                {service.name}
              </h1>
              <p className="mt-2 max-w-xl text-ash">{service.description}</p>
            </div>

            <div className="text-right text-xs text-ash-dim">
              <p>
                Owner{" "}
                <span className="text-bone">{service.owner}</span>
              </p>
              <a
                href={`https://${service.repository}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block font-mono text-ash hover:text-bone underline underline-offset-2"
              >
                {service.repository}
              </a>
            </div>
          </div>

          {day ? (
            <p className="mt-4 border border-ember/30 bg-ember/10 px-4 py-2 text-sm text-ember">
              Health snapshot for {day}
            </p>
          ) : null}

          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="border border-line bg-char-2 p-5">
                <p className="eyebrow">{stat.label}</p>
                <p
                  className={`mt-1 text-3xl font-medium ${stat.accent ? "text-crimson" : "text-bone"}`}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section className="border border-line bg-char">
              <div className="border-b border-line p-6">
                <p className="eyebrow">History</p>
                <h2 className="mt-1 font-serif text-2xl italic text-bone">
                  Recent Deployments
                </h2>
              </div>

              <ul className="divide-y divide-line">
                {serviceDeployments.length === 0 ? (
                  <li className="p-6 text-sm text-ash-dim">
                    No deployments recorded.
                  </li>
                ) : (
                  serviceDeployments.map((deployment) => (
                    <li key={deployment.id}>
                      <Link
                        href={`/deployments/${deployment.id}`}
                        className="block p-5 transition-colors hover:bg-char-2"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-medium text-bone">
                            #{deployment.id} · {deployment.author}
                          </span>
                          {deployment.regressionDetected ? (
                            <span className="border border-crimson/30 bg-crimson/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-crimson">
                              Regression
                            </span>
                          ) : (
                            <span className="border border-spark/30 bg-spark/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-spark">
                              {deployment.status}
                            </span>
                          )}
                        </div>
                        <p className="mt-1.5 text-xs text-ash-dim">
                          {deployment.pr
                            ? `PR #${deployment.pr.number}: ${deployment.pr.title}`
                            : "Direct push"}
                        </p>
                        <p className="mt-1 text-[10px] text-ash-dim">
                          {new Date(deployment.deployedAt).toLocaleString()} ·{" "}
                          {deployment.filesChanged} files ·+
                          {deployment.linesAdded}/-
                          {deployment.linesRemoved}
                        </p>
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </section>

            <section className="border border-line bg-char">
              <div className="border-b border-line p-6">
                <p className="eyebrow">Incidents</p>
                <h2 className="mt-1 font-serif text-2xl italic text-bone">
                  Regressions
                </h2>
              </div>

              <ul className="divide-y divide-line">
                {serviceRegressions.length === 0 ? (
                  <li className="p-6 text-sm text-spark">
                    No regressions detected.
                  </li>
                ) : (
                  serviceRegressions.map((regression) => (
                    <li key={regression.id}>
                      <Link
                        href={`/deployments/${regression.deploymentId}`}
                        className="block p-5 transition-colors hover:bg-char-2"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-medium text-bone">
                            {regression.detectedMetric}
                          </span>
                          <span className="text-crimson text-xs font-medium">
                            +{regression.percentageChange}%
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs text-ash-dim">
                          {regression.beforeValue} → {regression.afterValue} ·{" "}
                          <span className="capitalize">
                            {regression.status}
                          </span>
                        </p>
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}