import Navigation from "@/components/Navigation";
import DashboardHeader from "@/components/DashboardHeader";
import StatsRow from "@/components/StatsRow";
import ServiceHealthHeatmap from "@/components/ServiceHealthHeatmap";
import { recentDeployments, services } from "@/app/lib/deployment-data";
import Link from "next/link";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    success: "bg-spark/10 text-spark border-spark/30",
    failed: "bg-crimson/10 text-crimson border-crimson/30",
    pending: "bg-ember/10 text-ember border-ember/30",
    "rolled-back": "bg-ash-dim/10 text-ash-dim border-ash-dim/30",
  };
  return (
    <span className={`px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider border ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
}

function HealthBadge({ health }: { health: string }) {
  const styles: Record<string, string> = {
    healthy: "bg-spark/10 text-spark border-spark/30",
    degraded: "bg-ember/10 text-ember border-ember/30",
    critical: "bg-crimson/10 text-crimson border-crimson/30",
  };
  return (
    <span className={`px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider border ${styles[health] || styles.healthy}`}>
      {health}
    </span>
  );
}

export default function OverviewPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen p-8">
        <div className="mx-auto max-w-7xl">
          <DashboardHeader />

          <div className="heat-rule mt-6" />

          <div className="mt-8">
            <StatsRow />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <ServiceHealthHeatmap />

            <aside className="border border-line bg-char-2 p-6">
              <p className="eyebrow">Recent Deployments</p>
              <h2 className="mt-1 font-serif text-2xl italic text-bone">
                Latest Activity
              </h2>

              <ul className="mt-6 divide-y divide-line">
                {recentDeployments.slice(0, 5).map((deployment) => (
                  <li key={deployment.id}>
                    <Link
                      href={`/deployments/${deployment.id}`}
                      className="block py-4 first:pt-0 last:pb-0 transition-colors hover:bg-char-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-char flex items-center justify-center text-xs font-medium text-ash">
                            {deployment.authorAvatar}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-bone">
                              {deployment.service}
                            </p>
                            <p className="text-[10px] text-ash-dim">
                              #{deployment.id} · {deployment.author}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={deployment.status} />
                          {deployment.regressionDetected && (
                            <span className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider border bg-crimson/10 text-crimson border-crimson/30">
                              Regression
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-ash-dim">
                        {deployment.pr ? `PR #${deployment.pr.number}: ${deployment.pr.title}` : "Direct push"}
                      </p>
                      <p className="mt-1 text-[10px] text-ash-dim">
                        {new Date(deployment.deployedAt).toLocaleString()} · {deployment.filesChanged} files · +{deployment.linesAdded}/-{deployment.linesRemoved}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>

              <Link
                href="/deployments"
                className="block mt-4 text-center text-sm text-ash hover:text-bone"
              >
                View all deployments →
              </Link>
            </aside>
          </div>

          <div className="mt-6 border border-line bg-char p-6">
            <p className="eyebrow">Service Health Overview</p>
            <h2 className="mt-1 font-serif text-2xl italic text-bone">
              All Services
            </h2>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-[10px] uppercase tracking-wider text-ash-dim">
                    <th className="pb-3 pr-6 font-medium">Service</th>
                    <th className="pb-3 pr-6 font-medium">Health</th>
                    <th className="pb-3 pr-6 font-medium">Deployments</th>
                    <th className="pb-3 pr-6 font-medium">Regressions</th>
                    <th className="pb-3 pr-6 font-medium">Error Rate</th>
                    <th className="pb-3 pr-6 font-medium">P95 Latency</th>
                    <th className="pb-3 font-medium">Owner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {services.map((service) => (
                    <tr key={service.id} className="hover:bg-char-1 transition-colors">
                      <td className="py-4 pr-6">
                        <Link
                          href={`/services/${service.id}`}
                          className="font-medium text-bone hover:text-spark"
                        >
                          {service.name}
                        </Link>
                        <p className="text-[10px] text-ash-dim mt-0.5">{service.description}</p>
                      </td>
                      <td className="py-4 pr-6">
                        <HealthBadge health={service.recentHealth} />
                      </td>
                      <td className="py-4 pr-6 text-ash">{service.deploymentCount}</td>
                      <td className="py-4 pr-6 text-ash">{service.regressionCount}</td>
                      <td className="py-4 pr-6 text-ash">{service.errorRate.toFixed(1)}%</td>
                      <td className="py-4 pr-6 text-ash">{service.p95Latency}ms</td>
                      <td className="py-4 text-ash-dim">{service.owner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}