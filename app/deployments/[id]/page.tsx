"use client";

import { use, useState } from "react";
import Navigation from "@/components/Navigation";
import { getDeploymentById, getMetricSnapshots, getRegressionsByDeployment } from "@/app/lib/deployment-data";
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

function MetricCard({ label, before, after, unit, change, isRegression }: { label: string; before: number; after: number; unit: string; change: number; isRegression: boolean }) {
  const changeColor = change > 0 ? "text-crimson" : "text-spark";
  const changePrefix = change > 0 ? "+" : "";
  
  return (
    <div className="border border-line bg-char p-5">
      <p className="eyebrow">{label}</p>
      <div className="mt-3 flex items-baseline justify-between">
        <div>
          <p className="text-3xl font-medium text-bone">
            {after.toLocaleString()}{unit}
          </p>
          <p className="mt-1 text-xs text-ash-dim">
            was {before.toLocaleString()}{unit}
          </p>
        </div>
        <div className={`text-right ${changeColor}`}>
          <p className="text-xl font-medium">
            {changePrefix}{change.toFixed(1)}%
          </p>
          {isRegression && (
            <p className="mt-1 text-[10px] font-medium uppercase tracking-wider bg-crimson/10 text-crimson border border-crimson/30 inline-block px-2 py-0.5">
              Potential Regression
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function SparklineChart({ data, metric, deploymentMarkerIndex }: { data: number[]; metric: string; deploymentMarkerIndex: number }) {
  const width = 400;
  const height = 120;
  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);
  const range = maxVal - minVal || 1;
  
  const points = data.map((val, i) => {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((val - minVal) / range) * chartHeight;
    return { x, y };
  });
  
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  
  return (
    <div className="relative w-full h-[120px]">
      <svg viewBox="0 0 400 120" className="w-full h-full">
        <defs>
          <linearGradient id={`gradient-${metric}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-ember)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--color-ember)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={path}
          stroke="var(--color-ember)"
          strokeWidth="2"
          fill="none"
          className="drop-shadow-[0_0_8px_var(--color-ember)]"
        />
        <path
          d={path + ` L${points[points.length - 1].x} ${height - padding} L${points[0].x} ${height - padding} Z`}
          fill={`url(#gradient-${metric})`}
        />
        <line
          x1={padding + (deploymentMarkerIndex / (data.length - 1)) * chartWidth}
          y1={padding}
          x2={padding + (deploymentMarkerIndex / (data.length - 1)) * chartWidth}
          y2={height - padding}
          stroke="var(--color-spark)"
          strokeWidth="2"
          strokeDasharray="4,4"
        />
        <circle
          cx={padding + (deploymentMarkerIndex / (data.length - 1)) * chartWidth}
          cy={points[deploymentMarkerIndex].y}
          r={5}
          fill="var(--color-spark)"
          stroke="var(--color-void)"
          strokeWidth={2}
        />
      </svg>
      <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[10px] text-ash-dim">
        <span>Pre-deployment</span>
        <span className="text-spark font-medium">Deployment</span>
        <span>Post-deployment</span>
      </div>
    </div>
  );
}

export default function DeploymentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [metricView, setMetricView] = useState<"error-rate" | "p95-latency" | "http-5xx">("error-rate");
  
  const deploymentId = parseInt(use(params).id, 10);
  const deployment = getDeploymentById(deploymentId);
  const metrics = getMetricSnapshots(deploymentId);
  const regressions = getRegressionsByDeployment(deploymentId);

  if (!deployment) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen p-8">
          <div className="mx-auto max-w-7xl">
            <Link href="/deployments" className="text-sm text-ash-dim hover:text-bone">← Back to deployments</Link>
            <div className="mt-12 border border-line p-8 text-center">
              <p className="eyebrow">Not Found</p>
              <h1 className="mt-2 font-serif text-3xl italic">Deployment not found</h1>
            </div>
          </div>
        </main>
      </>
    );
  }

  const errorRates = metrics.map(m => m.errorRate);
  const latencies = metrics.map(m => m.p95Latency);
  const http5xx = metrics.map(m => m.http5xx);
  const deploymentMarkerIndex = metrics.findIndex(m => m.deploymentMarker);

  const beforeErrorRate = metrics.filter((_, i) => i < deploymentMarkerIndex).reduce((a, b) => a + b.errorRate, 0) / Math.max(1, deploymentMarkerIndex);
  const afterErrorRate = metrics.filter((_, i) => i > deploymentMarkerIndex).reduce((a, b) => a + b.errorRate, 0) / Math.max(1, metrics.length - deploymentMarkerIndex - 1);
  const beforeLatency = metrics.filter((_, i) => i < deploymentMarkerIndex).reduce((a, b) => a + b.p95Latency, 0) / Math.max(1, deploymentMarkerIndex);
  const afterLatency = metrics.filter((_, i) => i > deploymentMarkerIndex).reduce((a, b) => a + b.p95Latency, 0) / Math.max(1, metrics.length - deploymentMarkerIndex - 1);
  const beforeHttp5xx = metrics.filter((_, i) => i < deploymentMarkerIndex).reduce((a, b) => a + b.http5xx, 0) / Math.max(1, deploymentMarkerIndex);
  const afterHttp5xx = metrics.filter((_, i) => i > deploymentMarkerIndex).reduce((a, b) => a + b.http5xx, 0) / Math.max(1, metrics.length - deploymentMarkerIndex - 1);

  const errorRateChange = ((afterErrorRate - beforeErrorRate) / beforeErrorRate) * 100;
  const latencyChange = ((afterLatency - beforeLatency) / beforeLatency) * 100;
  const http5xxChange = ((afterHttp5xx - beforeHttp5xx) / beforeHttp5xx) * 100;

  return (
    <>
      <Navigation />
      <main className="min-h-screen p-8">
        <div className="mx-auto max-w-7xl">
          <Link href="/deployments" className="text-sm text-ash-dim hover:text-bone mb-6 block">← Back to deployments</Link>

          <div className="mb-8">
            <div className="flex items-baseline justify-between gap-4 flex-wrap">
              <div>
                <p className="eyebrow">Deployment #{deployment.id}</p>
                <h1 className="mt-1 font-serif text-4xl italic text-bone flex items-center gap-3">
                  {deployment.service}
                  <StatusBadge status={deployment.status} />
                  {deployment.regressionDetected && (
                    <span className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider border bg-crimson/10 text-crimson border-crimson/30">
                      Regression Detected
                    </span>
                  )}
                </h1>
              </div>
              <div className="text-right text-ash-dim">
                <p>{new Date(deployment.deployedAt).toLocaleString()}</p>
                <p className="text-xs">Commit {deployment.commitSha}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
            <div className="lg:col-span-2 border border-line bg-char p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-xl italic text-bone">Production Impact</h2>
                <div className="flex gap-2">
                  {(["error-rate", "p95-latency", "http-5xx"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMetricView(m)}
                      className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wider rounded transition-colors ${
                        metricView === m
                          ? "bg-ember/20 text-ember border border-ember/30"
                          : "text-ash hover:text-bone hover:bg-char-2"
                      }`}
                    >
                      {m === "error-rate" ? "Error Rate" : m === "p95-latency" ? "P95 Latency" : "HTTP 5xx"}
                    </button>
                  ))}
                </div>
              </div>

              <SparklineChart
                data={metricView === "error-rate" ? errorRates : metricView === "p95-latency" ? latencies : http5xx}
                metric={metricView}
                deploymentMarkerIndex={deploymentMarkerIndex}
              />
            </div>

            <aside className="border border-line bg-char-2 p-6">
              <h2 className="font-serif text-xl italic text-bone mb-4">Deployment Info</h2>
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="eyebrow">Author</dt>
                  <dd className="mt-1 flex items-center gap-2 text-bone">
                    <div className="w-8 h-8 rounded-full bg-char flex items-center justify-center text-xs font-medium text-ash">
                      {deployment.authorAvatar}
                    </div>
                    {deployment.author}
                  </dd>
                </div>
                {deployment.pr && (
                  <div>
                    <dt className="eyebrow">Pull Request</dt>
                    <dd className="mt-1">
                      <a href={deployment.pr.url} target="_blank" rel="noopener noreferrer" className="text-ash hover:text-bone underline underline-offset-2">
                        PR #{deployment.pr.number}: {deployment.pr.title}
                      </a>
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="eyebrow">Commit</dt>
                  <dd className="mt-1 font-mono text-ash">{deployment.commitSha}</dd>
                </div>
                <div>
                  <dt className="eyebrow">Files Changed</dt>
                  <dd className="mt-1 text-bone">{deployment.filesChanged} files · +{deployment.linesAdded} / -{deployment.linesRemoved}</dd>
                </div>
                <div>
                  <dt className="eyebrow">Status</dt>
                  <dd className="mt-1"><StatusBadge status={deployment.status} /></dd>
                </div>
              </dl>
            </aside>
          </div>

          {regressions.length > 0 && (
            <div className="border border-crimson/30 bg-crimson/5 p-6 mb-8">
              <h2 className="font-serif text-xl italic text-crimson mb-4 flex items-center gap-2">
                ⚠ Potential Regressions Detected
              </h2>
              <div className="space-y-3">
                {regressions.map((r) => (
                  <div key={r.id} className="border border-crimson/20 bg-char p-4 rounded">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-bone">{r.detectedMetric.replace(/-/g, ' ')}</p>
                        <p className="text-xs text-ash-dim mt-0.5">
                          {r.beforeValue.toLocaleString()} → {r.afterValue.toLocaleString()} ({r.percentageChange > 0 ? '+' : ''}{r.percentageChange}%)
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider border ${
                          r.severity === 'critical' ? 'bg-crimson/10 text-crimson border-crimson/30' :
                          r.severity === 'high' ? 'bg-ember/10 text-ember border-ember/30' :
                          'bg-burnt/10 text-burnt border-burnt/30'
                        }`}>
                          {r.severity}
                        </span>
                        <p className="mt-1 text-xs text-ash-dim">{r.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <MetricCard
              label="Error Rate"
              before={beforeErrorRate}
              after={afterErrorRate}
              unit="%"
              change={errorRateChange}
              isRegression={regressions.some(r => r.detectedMetric === "error-rate")}
            />
            <MetricCard
              label="P95 Latency"
              before={beforeLatency}
              after={afterLatency}
              unit="ms"
              change={latencyChange}
              isRegression={regressions.some(r => r.detectedMetric === "p95-latency")}
            />
            <MetricCard
              label="HTTP 5xx"
              before={beforeHttp5xx}
              after={afterHttp5xx}
              unit=""
              change={http5xxChange}
              isRegression={regressions.some(r => r.detectedMetric === "http-5xx")}
            />
          </div>

          <div className="mt-8 border border-line bg-char p-6">
            <h2 className="font-serif text-xl italic text-bone mb-4">All Metrics Timeline</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-[10px] uppercase tracking-wider text-ash-dim">
                    <th className="pb-3 pr-6 font-medium">Time</th>
                    <th className="pb-3 pr-6 font-medium">Error Rate</th>
                    <th className="pb-3 pr-6 font-medium">P95 Latency</th>
                    <th className="pb-3 pr-6 font-medium">HTTP 5xx</th>
                    <th className="pb-3 font-medium">Throughput</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {metrics.map((m, i) => (
                    <tr key={i} className={`${m.deploymentMarker ? 'bg-ember/5' : ''} ${i === deploymentMarkerIndex ? 'border-l-2 border-spark' : ''}`}>
                      <td className="py-2 pr-6 font-mono text-ash-dim">{new Date(m.timestamp).toLocaleTimeString()}</td>
                      <td className="py-2 pr-6 text-ash">{m.errorRate.toFixed(2)}%</td>
                      <td className="py-2 pr-6 text-ash">{m.p95Latency}ms</td>
                      <td className="py-2 pr-6 text-ash">{m.http5xx}</td>
                      <td className="py-2 text-ash">{m.throughput.toLocaleString()}/min</td>
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