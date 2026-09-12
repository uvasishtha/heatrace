import DashboardHeader from "@/app/components/DashboardHeader";
import StatsRow from "@/app/components/StatsRow";
import UsageHeatmap from "@/app/components/UsageHeatmap";
import SignalsPanel from "@/app/components/SignalsPanel";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <DashboardHeader />

        <div className="mt-8">
          <StatsRow />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <UsageHeatmap />
          <SignalsPanel />
        </div>
      </div>
    </main>
  );
}
