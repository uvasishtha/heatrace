import { signals, type Signal } from "@/app/lib/dashboard-data";

const SEVERITY_STYLES: Record<Signal["severity"], string> = {
  info: "border-ash-dim",
  warning: "border-burnt",
  critical: "border-spark",
};

const SEVERITY_LABEL_STYLES: Record<Signal["severity"], string> = {
  info: "text-ash-dim",
  warning: "text-burnt",
  critical: "text-spark",
};

export default function SignalsPanel() {
  return (
    <aside className="border border-line bg-char-2 p-6">
      <p className="eyebrow">Worth a look</p>
      <h2 className="mt-1 font-serif text-2xl italic text-bone">Signals</h2>

      <ul className="mt-6 divide-y divide-line">
        {signals.map((signal) => (
          <li
            key={signal.id}
            className={`border-l-2 py-4 pl-4 first:pt-0 last:pb-0 ${SEVERITY_STYLES[signal.severity]}`}
          >
            <span
              className={`text-[10px] font-medium uppercase tracking-wider ${SEVERITY_LABEL_STYLES[signal.severity]}`}
            >
              {signal.severity}
            </span>

            <p className="mt-2 text-sm font-medium text-bone">
              {signal.title}
            </p>

            <p className="mt-1 text-sm text-ash">{signal.description}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
