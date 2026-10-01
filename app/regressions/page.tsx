import Link from "next/link";
import Navigation from "@/components/Navigation";
import { regressions, type Regression } from "@/app/lib/deployment-data";

const SEVERITY_STYLES: Record<Regression["severity"], string> = {
  low: "border-ash-dim/40 bg-ash-dim/10 text-ash-dim",
  medium: "border-burnt/40 bg-burnt/10 text-burnt",
  high: "border-ember/40 bg-ember/10 text-ember",
  critical: "border-crimson/60 bg-crimson/15 text-spark",
};

const STATUS_STYLES: Record<Regression["status"], string> = {
  detected: "text-ember",
  investigating: "text-burnt",
  confirmed: "text-crimson",
  resolved: "text-spark",
  "false-positive": "text-ash-dim",
};

const METRIC_LABELS: Record<Regression["detectedMetric"], string> = {
  "error-rate": "Error Rate",
  "p95-latency": "P95 Latency",
  "http-5xx": "HTTP 5xx",
  throughput: "Throughput",
};

function formatValue(metric: Regression["detectedMetric"], value: number) {
  if (metric === "error-rate") return `${value}%`;
  if (metric === "throughput") return `${value.toLocaleString()} rps`;
  return `${value}`;
}

export default async function RegressionsPage({
  searchParams,
}: {
  searchParams: Promise<{ deployment?: string }>;
}) {
  const { deployment } = await searchParams;
  const highlighted = deployment ? Number(deployment) : null;

  const list = [...regressions].sort(
    (a, b) => Date.parse(b.detectedAt) - Date.parse(a.detectedAt)
  );

  return (
    <>
      <Navigation />
      <main className="min-h-screen p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="eyebrow">Deployment intelligence</p>
            <h1 className="mt-1 font-serif text-4xl italic text-bone">
              Regressions
            </h1>
            <p className="mt-2 text-ash">
              Metric changes detected after a deployment went live.
            </p>
          </div>

          <div className="border border-line bg-char">
            <div className="grid grid-cols-1 divide-y divide-line md:grid-cols-2 md:divide-y-0">
              {list.map((regression) => (
                <article
                  key={regression.id}
                  className={`border-line p-6 transition-colors hover:bg-char-2 ${
                    highlighted === regression.deploymentId
                      ? "bg-char-2 outline outline-1 outline-ember/40"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-bone">
                        {regression.service}
                      </p>
                      <Link
                        href={`/deployments/${regression.deploymentId}`}
                        className="text-xs text-ash-dim hover:text-spark"
                      >
                        Deployment #{regression.deploymentId}
                      </Link>
                    </div>

                    <span
                      className={`border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${SEVERITY_STYLES[regression.severity]}`}
                    >
                      {regression.severity}
                    </span>
                  </div>

                  <div className="mt-4 flex items-baseline gap-3">
                    <span className="font-serif text-2xl italic text-bone">
                      {METRIC_LABELS[regression.detectedMetric]}
                    </span>
                    <span className="text-crimson text-sm font-medium">
                      +{regression.percentageChange}%
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-ash-dim">
                    {formatValue(regression.detectedMetric, regression.beforeValue)} →{" "}
                    {formatValue(regression.detectedMetric, regression.afterValue)}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-[10px] text-ash-dim">
                    <span className={STATUS_STYLES[regression.status]}>
                      {regression.status}
                    </span>
                    <span>
                      {regression.assignedTo
                        ? `${regression.assignedTo} · `
                        : ""}
                      {new Date(regression.detectedAt).toLocaleString()}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}