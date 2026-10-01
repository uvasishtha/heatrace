"use client";

import { useState, useMemo } from "react";
import Navigation from "@/components/Navigation";
import { deployments } from "@/app/lib/deployment-data";
import Link from "next/link";

const STATUSES = ["all", "success", "failed", "pending", "rolled-back"] as const;
const SERVICES = ["all", "checkout-api", "payments-api", "auth-service", "user-service", "notification-service"] as const;

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

function sortValue(value: unknown): string | number {
  if (value == null) return "";
  if (typeof value === "number") return value;
  if (typeof value === "string") return value;
  return String(value);
}

export default function DeploymentsPage() {
  const [statusFilter, setStatusFilter] = useState<typeof STATUSES[number]>("all");
  const [serviceFilter, setServiceFilter] = useState<typeof SERVICES[number]>("all");
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({ key: "deployedAt", direction: "desc" });

  const filteredDeployments = useMemo(() => {
    return deployments
      .filter((d) => {
        if (statusFilter !== "all" && d.status !== statusFilter) return false;
        if (serviceFilter !== "all" && d.service !== serviceFilter) return false;
        if (search) {
          const searchLower = search.toLowerCase();
          if (
            !d.service.toLowerCase().includes(searchLower) &&
            !d.author.toLowerCase().includes(searchLower) &&
            !d.commitSha.toLowerCase().includes(searchLower) &&
            !(d.pr?.title.toLowerCase().includes(searchLower)) &&
            !(d.pr?.number.toString().includes(searchLower))
          ) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        const aVal = sortValue(a[sortConfig.key as keyof typeof a]);
        const bVal = sortValue(b[sortConfig.key as keyof typeof b]);
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
  }, [statusFilter, serviceFilter, search, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="eyebrow">Deployment intelligence</p>
            <h1 className="mt-1 font-serif text-4xl italic text-bone">
              Deployments
            </h1>
            <p className="mt-2 text-ash">
              All deployment activity across services. Filter and sort to investigate.
            </p>
          </div>

          <div className="border border-line bg-char p-4 mb-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-3 md:flex-row md:items-center gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search deployments..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-64 pl-10 pr-4 py-2 text-sm border border-line bg-char-2 text-bone placeholder-ash-dim focus:outline-none focus:border-ember focus:ring-1 focus:ring-ember"
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ash-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                <select
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value as typeof SERVICES[number])}
                  className="px-3 py-2 text-sm border border-line bg-char-2 text-bone focus:outline-none focus:border-ember focus:ring-1 focus:ring-ember"
                >
                  {SERVICES.map((s) => (
                    <option key={s} value={s}>
                      {s === "all" ? "All Services" : s}
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as typeof STATUSES[number])}
                  className="px-3 py-2 text-sm border border-line bg-char-2 text-bone focus:outline-none focus:border-ember focus:ring-1 focus:ring-ember"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s === "all" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-sm text-ash-dim">
                {filteredDeployments.length} of {deployments.length} deployments
              </div>
            </div>
          </div>

          <div className="border border-line bg-char overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-line bg-char-2 text-[10px] uppercase tracking-wider text-ash-dim">
                    <th className="px-4 py-3 font-medium cursor-pointer hover:text-bone" onClick={() => handleSort("id")}>
                      ID {sortConfig.key === "id" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-4 py-3 font-medium cursor-pointer hover:text-bone" onClick={() => handleSort("service")}>
                      Service {sortConfig.key === "service" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-4 py-3 font-medium cursor-pointer hover:text-bone" onClick={() => handleSort("author")}>
                      Author {sortConfig.key === "author" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-4 py-3 font-medium">PR / Commit</th>
                    <th className="px-4 py-3 font-medium cursor-pointer hover:text-bone" onClick={() => handleSort("deployedAt")}>
                      Deployed {sortConfig.key === "deployedAt" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-4 py-3 font-medium">Changes</th>
                    <th className="px-4 py-3 font-medium cursor-pointer hover:text-bone" onClick={() => handleSort("status")}>
                      Status {sortConfig.key === "status" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-4 py-3 font-medium">Regression</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filteredDeployments.map((deployment) => (
                    <tr key={deployment.id} className="hover:bg-char-1 transition-colors">
                      <td className="px-4 py-3 font-mono text-ash-dim">#{deployment.id}</td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/services/${deployment.service}`}
                          className="font-medium text-bone hover:text-spark"
                        >
                          {deployment.service}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-char flex items-center justify-center text-[10px] font-medium text-ash">
                            {deployment.authorAvatar}
                          </div>
                          <span className="text-ash">{deployment.author}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {deployment.pr ? (
                          <Link
                            href={deployment.pr.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-ash hover:text-bone underline underline-offset-2"
                          >
                            PR #{deployment.pr.number}
                          </Link>
                        ) : (
                          <span className="font-mono text-ash-dim">{deployment.commitSha}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-ash-dim">
                        {new Date(deployment.deployedAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-ash">
                        {deployment.filesChanged} files · +{deployment.linesAdded}/-{deployment.linesRemoved}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={deployment.status} />
                      </td>
                      <td className="px-4 py-3">
                        {deployment.regressionDetected ? (
                          <Link
                            href={`/regressions?deployment=${deployment.id}`}
                            className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider border bg-crimson/10 text-crimson border-crimson/30 hover:bg-crimson/20"
                          >
                            Detected
                          </Link>
                        ) : (
                          <span className="text-ash-dim">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredDeployments.length === 0 && (
              <div className="p-12 text-center text-ash-dim">
                No deployments match the current filters.
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}