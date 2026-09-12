import { signals, type Signal } from "@/app/lib/dashboard-data";

const SEVERITY_STYLES: Record<Signal["severity"], string> = {
  info: "bg-blue-50 text-blue-700",
  warning: "bg-amber-50 text-amber-700",
  critical: "bg-red-50 text-red-700",
};

export default function SignalsPanel() {
  return (
    <aside className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-medium text-gray-900">Signals</h2>

      <p className="mt-1 text-sm text-gray-500">
        Changes worth paying attention to.
      </p>

      <ul className="mt-6 space-y-4">
        {signals.map((signal) => (
          <li key={signal.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
            <span
              className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${SEVERITY_STYLES[signal.severity]}`}
            >
              {signal.severity}
            </span>

            <p className="mt-2 text-sm font-medium text-gray-900">
              {signal.title}
            </p>

            <p className="mt-1 text-sm text-gray-500">{signal.description}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
