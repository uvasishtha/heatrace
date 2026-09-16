import DashboardHeader from "@/components/DashboardHeader";
import StatsRow from "@/components/StatsRow";
import UsageHeatmap from "@/components/UsageHeatmap";
import SignalsPanel from "@/components/SignalsPanel";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-7xl">
        <DashboardHeader />

        <div className="heat-rule mt-6" />

        <div className="mt-8">
          <StatsRow />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <UsageHeatmap />
          <SignalsPanel />
        </div>
      </div>
    </main>
  );
}
