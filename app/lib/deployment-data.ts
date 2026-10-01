export type DeploymentStatus = "success" | "failed" | "pending" | "rolled-back";

export type RegressionSeverity = "low" | "medium" | "high" | "critical";

export type RegressionStatus = "detected" | "investigating" | "confirmed" | "resolved" | "false-positive";

export interface PullRequest {
  number: number;
  title: string;
  url: string;
  author: string;
  authorAvatar: string;
  mergedAt: string;
}

export interface Deployment {
  id: number;
  service: string;
  author: string;
  authorAvatar: string;
  pr: PullRequest | null;
  commitSha: string;
  deployedAt: string;
  filesChanged: number;
  linesAdded: number;
  linesRemoved: number;
  status: DeploymentStatus;
  regressionDetected: boolean;
  regressionId?: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  deploymentCount: number;
  recentHealth: "healthy" | "degraded" | "critical";
  regressionCount: number;
  errorRate: number;
  p95Latency: number;
  recentDeployments: Deployment[];
  owner: string;
  repository: string;
}

export interface MetricSnapshot {
  timestamp: string;
  errorRate: number;
  p95Latency: number;
  http5xx: number;
  throughput: number;
  deploymentMarker?: boolean;
}

export interface Regression {
  id: number;
  service: string;
  deploymentId: number;
  detectedMetric: "error-rate" | "p95-latency" | "http-5xx" | "throughput";
  beforeValue: number;
  afterValue: number;
  percentageChange: number;
  detectedAt: string;
  severity: RegressionSeverity;
  status: RegressionStatus;
  assignedTo?: string;
}

export const services: Service[] = [
  {
    id: "checkout-api",
    name: "checkout-api",
    description: "Handles checkout flow, payment processing, and order confirmation",
    deploymentCount: 142,
    recentHealth: "critical",
    regressionCount: 3,
    errorRate: 4.2,
    p95Latency: 480,
    owner: "platform-team",
    repository: "github.com/acme/checkout-api",
    recentDeployments: [],
  },
  {
    id: "payments-api",
    name: "payments-api",
    description: "Payment processing, refunds, and transaction management",
    deploymentCount: 89,
    recentHealth: "degraded",
    regressionCount: 1,
    errorRate: 1.8,
    p95Latency: 320,
    owner: "payments-team",
    repository: "github.com/acme/payments-api",
    recentDeployments: [],
  },
  {
    id: "auth-service",
    name: "auth-service",
    description: "Authentication, authorization, and session management",
    deploymentCount: 67,
    recentHealth: "healthy",
    regressionCount: 0,
    errorRate: 0.1,
    p95Latency: 95,
    owner: "identity-team",
    repository: "github.com/acme/auth-service",
    recentDeployments: [],
  },
  {
    id: "user-service",
    name: "user-service",
    description: "User profiles, preferences, and account management",
    deploymentCount: 54,
    recentHealth: "healthy",
    regressionCount: 0,
    errorRate: 0.3,
    p95Latency: 145,
    owner: "platform-team",
    repository: "github.com/acme/user-service",
    recentDeployments: [],
  },
  {
    id: "notification-service",
    name: "notification-service",
    description: "Email, push, and in-app notifications",
    deploymentCount: 78,
    recentHealth: "degraded",
    regressionCount: 2,
    errorRate: 2.1,
    p95Latency: 280,
    owner: "platform-team",
    repository: "github.com/acme/notification-service",
    recentDeployments: [],
  },
];

function mulberry32(seed: number) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const prTitles = [
  "Fix race condition in payment processing",
  "Add retry logic for external API calls",
  "Optimize database queries for user lookup",
  "Update dependencies and fix vulnerabilities",
  "Refactor authentication middleware",
  "Add distributed tracing instrumentation",
  "Fix memory leak in notification worker",
  "Improve error handling for edge cases",
  "Add feature flag for new checkout flow",
  "Migrate to new payment provider SDK",
  "Optimize Redis connection pooling",
  "Fix timeout handling in auth flow",
  "Add circuit breaker for external services",
  "Update logging format for observability",
  "Fix cache invalidation bug",
];

const authors = [
  { name: "Sarah Chen", avatar: "SC" },
  { name: "Marcus Johnson", avatar: "MJ" },
  { name: "Emily Rodriguez", avatar: "ER" },
  { name: "David Park", avatar: "DP" },
  { name: "Lisa Wang", avatar: "LW" },
  { name: "James Kim", avatar: "JK" },
  { name: "Rachel Green", avatar: "RG" },
  { name: "Alex Turner", avatar: "AT" },
];

function generateDeployments(): Deployment[] {
  const random = mulberry32(12345);
  const deployments: Deployment[] = [];
  const now = new Date();
  const serviceNames = services.map((s) => s.id);

  for (let i = 284; i >= 100; i--) {
    const serviceId = serviceNames[Math.floor(random() * serviceNames.length)];
    const author = authors[Math.floor(random() * authors.length)];
    const daysAgo = Math.floor(random() * 30);
    const hoursAgo = Math.floor(random() * 24);
    const deployedAt = new Date(now.getTime() - daysAgo * 86400000 - hoursAgo * 3600000);
    
    const hasPr = random() > 0.15;
    const prNumber = hasPr ? 1000 + Math.floor(random() * 500) : null;
    
    const statuses: DeploymentStatus[] = ["success", "success", "success", "success", "failed", "rolled-back", "pending"];
    const status = statuses[Math.floor(random() * statuses.length)];
    
    const regressionDetected = status === "success" && random() > 0.85;

    deployments.push({
      id: i,
      service: serviceId,
      author: author.name,
      authorAvatar: author.avatar,
      pr: hasPr
        ? {
            number: prNumber!,
            title: prTitles[Math.floor(random() * prTitles.length)],
            url: `https://github.com/acme/${serviceId}/pull/${prNumber}`,
            author: author.name,
            authorAvatar: author.avatar,
            mergedAt: new Date(deployedAt.getTime() - Math.floor(random() * 86400000)).toISOString(),
          }
        : null,
      commitSha: Array.from({ length: 7 }, () => "0123456789abcdef"[Math.floor(random() * 16)]).join(""),
      deployedAt: deployedAt.toISOString(),
      filesChanged: Math.floor(random() * 30) + 1,
      linesAdded: Math.floor(random() * 500) + 10,
      linesRemoved: Math.floor(random() * 200) + 5,
      status,
      regressionDetected,
      regressionId: regressionDetected ? 100 + Math.floor(random() * 10) : undefined,
    });
  }

  return deployments.sort((a, b) => new Date(b.deployedAt).getTime() - new Date(a.deployedAt).getTime());
}

export const deployments = generateDeployments();

function generateMetricSnapshots(deploymentTime: string, hasRegression: boolean): MetricSnapshot[] {
  const random = mulberry32(Date.parse(deploymentTime));
  const snapshots: MetricSnapshot[] = [];
  const baseTime = new Date(deploymentTime);
  
  const baseErrorRate = hasRegression ? 0.8 + random() * 0.5 : 0.1 + random() * 0.3;
  const baseLatency = hasRegression ? 200 + random() * 50 : 80 + random() * 40;
  const baseHttp5xx = hasRegression ? 100 + random() * 50 : 5 + random() * 15;
  const baseThroughput = 1000 + random() * 500;

  for (let i = -60; i <= 60; i += 5) {
    const timestamp = new Date(baseTime.getTime() + i * 60000);
    const isAfter = i > 0;
    const isDeploymentMarker = i === 0;
    
    let errorRate = baseErrorRate;
    let latency = baseLatency;
    let http5xx = baseHttp5xx;
    let throughput = baseThroughput;

    if (hasRegression && isAfter) {
      const severity = 1 + random() * 3;
      errorRate = baseErrorRate * severity;
      latency = baseLatency * (1 + (severity - 1) * 0.5);
      http5xx = baseHttp5xx * severity;
      throughput = baseThroughput * (1 - (severity - 1) * 0.1);
    }

    if (isAfter && !hasRegression) {
      errorRate = baseErrorRate * (0.9 + random() * 0.2);
      latency = baseLatency * (0.95 + random() * 0.1);
      http5xx = baseHttp5xx * (0.9 + random() * 0.2);
    }

    snapshots.push({
      timestamp: timestamp.toISOString(),
      errorRate: Number(errorRate.toFixed(2)),
      p95Latency: Number(latency.toFixed(0)),
      http5xx: Math.round(http5xx),
      throughput: Math.round(throughput),
      deploymentMarker: isDeploymentMarker,
    });
  }

  return snapshots;
}

export function getMetricSnapshots(deploymentId: number): MetricSnapshot[] {
  const deployment = deployments.find((d) => d.id === deploymentId);
  if (!deployment) return [];
  return generateMetricSnapshots(deployment.deployedAt, deployment.regressionDetected);
}

export const regressions: Regression[] = [
  {
    id: 101,
    service: "checkout-api",
    deploymentId: 284,
    detectedMetric: "error-rate",
    beforeValue: 0.8,
    afterValue: 4.2,
    percentageChange: 425,
    detectedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    severity: "critical",
    status: "confirmed",
    assignedTo: "Sarah Chen",
  },
  {
    id: 102,
    service: "checkout-api",
    deploymentId: 284,
    detectedMetric: "p95-latency",
    beforeValue: 210,
    afterValue: 480,
    percentageChange: 129,
    detectedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    severity: "high",
    status: "confirmed",
    assignedTo: "Sarah Chen",
  },
  {
    id: 103,
    service: "checkout-api",
    deploymentId: 284,
    detectedMetric: "http-5xx",
    beforeValue: 123,
    afterValue: 506,
    percentageChange: 312,
    detectedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    severity: "critical",
    status: "confirmed",
    assignedTo: "Marcus Johnson",
  },
  {
    id: 104,
    service: "payments-api",
    deploymentId: 271,
    detectedMetric: "error-rate",
    beforeValue: 0.3,
    afterValue: 2.1,
    percentageChange: 600,
    detectedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    severity: "high",
    status: "investigating",
    assignedTo: "Emily Rodriguez",
  },
  {
    id: 105,
    service: "notification-service",
    deploymentId: 256,
    detectedMetric: "p95-latency",
    beforeValue: 180,
    afterValue: 420,
    percentageChange: 133,
    detectedAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    severity: "medium",
    status: "resolved",
    assignedTo: "David Park",
  },
  {
    id: 106,
    service: "notification-service",
    deploymentId: 243,
    detectedMetric: "error-rate",
    beforeValue: 0.5,
    afterValue: 3.8,
    percentageChange: 660,
    detectedAt: new Date(Date.now() - 72 * 3600000).toISOString(),
    severity: "high",
    status: "false-positive",
    assignedTo: "Lisa Wang",
  },
];

export const serviceHeatmapData = [
  { service: "checkout-api", health: [80, 85, 65, 30, 25] },
  { service: "payments-api", health: [90, 88, 92, 70, 85] },
  { id: "auth-service", name: "auth-service", health: [95, 96, 94, 95, 93] },
  { id: "user-service", name: "user-service", health: [92, 93, 91, 94, 92] },
  { id: "notification-service", name: "notification-service", health: [85, 82, 88, 60, 75] },
];

export const healthDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export function healthClass(value: number): string {
  if (value >= 90) return "bg-spark";
  if (value >= 75) return "bg-ember";
  if (value >= 60) return "bg-burnt";
  if (value >= 40) return "bg-crimson";
  return "bg-char-2";
}

export function healthLabel(value: number): string {
  if (value >= 90) return "Healthy";
  if (value >= 75) return "Good";
  if (value >= 60) return "Degraded";
  if (value >= 40) return "Unhealthy";
  return "Critical";
}

export const overviewStats = [
  {
    id: "total-deployments",
    label: "Total Deployments",
    value: "184",
    change: "+12%",
    trend: "up" as const,
  },
  {
    id: "potential-regressions",
    label: "Potential Regressions",
    value: "6",
    change: "+2",
    trend: "up" as const,
  },
  {
    id: "services-monitored",
    label: "Services Monitored",
    value: "5",
    change: "0",
    trend: "up" as const,
  },
  {
    id: "success-rate",
    label: "Deployment Success Rate",
    value: "94.6%",
    change: "-1.2%",
    trend: "down" as const,
  },
];

export const recentDeployments = deployments.slice(0, 10);

export function getDeploymentById(id: number): Deployment | undefined {
  return deployments.find((d) => d.id === id);
}

export function getRegressionsByDeployment(deploymentId: number): Regression[] {
  return regressions.filter((r) => r.deploymentId === deploymentId);
}

export function getServiceById(id: string): Service | undefined {
  return services.find((s) => s.id === id);
}