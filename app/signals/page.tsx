import { signals } from "@/app/lib/dashboard-data";

export default function SignalsPage() {
  return (
    <main className="p-8">
      {/* Header */}
      <div>
        <p className="eyebrow">INTELLIGENCE</p>

        <h1 className="mt-1 font-serif text-4xl italic text-bone">
          Signals
        </h1>

        <p className="mt-2 text-ash">
          Changes and anomalies worth investigating.
        </p>
      </div>

      {/* Signals list */}
      <div className="mt-8 border border-line bg-char-2">
        {signals.map((signal) => (
          <div
            key={signal.id}
            className="border-b border-line p-6 last:border-b-0"
          >
            <div className="flex items-start justify-between">
              
              {/* Signal information */}
              <div>
                <span className="text-[10px] font-medium uppercase tracking-wider">
                  {signal.severity}
                </span>

                <h2 className="mt-2 text-lg font-medium text-bone">
                  {signal.title}
                </h2>

                <p className="mt-1 text-sm text-ash">
                  {signal.description}
                </p>
              </div>

              {/* Action */}
              <button className="text-sm text-ash hover:text-bone">
                Investigate →
              </button>

            </div>
          </div>
        ))}
      </div>
    </main>
  );
}