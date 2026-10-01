import Navigation from "@/components/Navigation";
import { signals, type Signal } from "@/app/lib/dashboard-data";

const SEVERITY_STYLES: Record<Signal["severity"], string> = {
  info: "border-ash-dim/40 text-ash-dim",
  warning: "border-burnt/50 text-burnt",
  critical: "border-spark/50 text-spark",
};

export default function SignalsPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen p-8">
        <div className="mx-auto max-w-4xl">
          <div>
            <p className="eyebrow">Intelligence</p>

            <h1 className="mt-1 font-serif text-4xl italic text-bone">
              Signals
            </h1>

            <p className="mt-2 text-ash">
              Changes and anomalies worth investigating.
            </p>
          </div>

          <div className="mt-8 border border-line bg-char-2">
            {signals.map((signal) => (
              <div
                key={signal.id}
                className="border-b border-line p-6 transition-colors last:border-b-0 hover:bg-char"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span
                      className={`border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${SEVERITY_STYLES[signal.severity]}`}
                    >
                      {signal.severity}
                    </span>

                    <h2 className="mt-2 text-lg font-medium text-bone">
                      {signal.title}
                    </h2>

                    <p className="mt-1 text-sm text-ash">
                      {signal.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}