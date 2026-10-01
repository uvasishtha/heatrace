"use client";

import Navigation from "@/components/Navigation";
import { services } from "@/app/lib/deployment-data";
import Link from "next/link";

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

function TrendIndicator({ value, trend }: { value: string; trend: "up" | "down" | "stable" }) {
  const colors = { up: "text-crimson", down: "text-spark", stable: "text-ash-dim" };
  const icons = { up: "↑", down: "↓", stable: "→" };
  return (
    <span className={`${colors[trend]} text-xs font-medium`}>
      {icons[trend]} {value}
    </span>
  );
}

export default function ServicesPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="eyebrow">Deployment intelligence</p>
            <h1 className="mt-1 font-serif text-4xl italic text-bone">
              Services
            </h1>
            <p className="mt-2 text-ash">
              All monitored services with health status, deployment activity, and regression history.
            </p>
          </div>

          <div className="border border-line bg-char overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-line bg-char-2 text-[10px] uppercase tracking-wider text-ash-dim">
                    <th className="px-4 py-3 font-medium">Service</th>
                    <th className="px-4 py-3 font-medium">Health</th>
                    <th className="px-4 py-3 font-medium">Deployments</th>
                    <th className="px-4 py-3 font-medium">Regressions</th>
                    <th className="px-4 py-3 font-medium">Error Rate</th>
                    <th className="px-4 py-3 font-medium">P95 Latency</th>
                    <th className="px-4 py-3 font-medium">Owner</th>
                    <th className="px-4 py-3 font-medium">Repository</th>
                    <th className="px-4 py-3 font-medium">Recent Activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {services.map((service) => (
                    <tr key={service.id} className="hover:bg-char-1 transition-colors">
                      <td className="px-4 py-4">
                        <Link
                          href={`/services/${service.id}`}
                          className="font-medium text-bone hover:text-spark"
                        >
                          {service.name}
                        </Link>
                        <p className="text-[10px] text-ash-dim mt-0.5">{service.description}</p>
                      </td>
                      <td className="px-4 py-4">
                        <HealthBadge health={service.recentHealth} />
                      </td>
                      <td className="px-4 py-4 text-ash">{service.deploymentCount}</td>
                      <td className="px-4 py-4">
                        {service.regressionCount > 0 ? (
                          <span className="text-crimson font-medium">{service.regressionCount}</span>
                        ) : (
                          <span className="text-spark">0</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-bone">{service.errorRate.toFixed(1)}%</span>
                          <TrendIndicator value="2.1%" trend={service.errorRate > 1 ? "up" : "stable"} />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-bone">{service.p95Latency}ms</span>
                          <TrendIndicator value="15%" trend={service.p95Latency > 200 ? "up" : "stable"} />
                        </div>
                      </td>
                      <td className="px-4 py-4 text-ash-dim">{service.owner}</td>
                      <td className="px-4 py-4">
                        <a href={`https://${service.repository}`} target="_blank" rel="noopener noreferrer" className="text-ash hover:text-bone underline underline-offset-2 font-mono text-xs">
                          {service.repository}
                        </a>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/services/${service.id}`}
                            className="px-3 py-1.5 text-xs font-medium uppercase tracking-wider border border-line text-ash hover:text-bone hover:border-ember hover:bg-char-2 transition-colors"
                          >
                            View Details
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link key={service.id} href={`/services/${service.id}`} className="border border-line bg-char-2 p-6 hover:border-ember/50 hover:bg-char transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-bone">{service.name}</p>
                    <p className="mt-1 text-xs text-ash-dim">{service.description}</p>
                  </div>
                  <HealthBadge health={service.recentHealth} />
                </div>

                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  <div className="bg-char p-3 rounded">
                    <p className="eyebrow">Deployments</p>
                    <p className="mt-1 text-2xl font-medium text-bone">{service.deploymentCount}</p>
                  </div>
                  <div className="bg-char p-3 rounded">
                    <p className="eyebrow">Regressions</p>
                    <p className="mt-1 text-2xl font-medium {service.regressionCount > 0 ? 'text-crimson' : 'text-spark'}">{service.regressionCount}</p>
                  </div>
                  <div className="bg-char p-3 rounded">
                    <p className="eyebrow">Error Rate</p>
                    <p className="mt-1 text-2xl font-medium text-bone">{service.errorRate.toFixed(1)}%</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-line">
                  <p className="text-xs text-ash-dim">P95 Latency: <span className="text-bone">{service.p95Latency}ms</span></p>
                  <p className="text-xs text-ash-dim mt-1">Owner: <span className="text-bone">{service.owner}</span></p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}