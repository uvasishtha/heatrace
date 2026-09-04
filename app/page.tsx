export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-semibold text-gray-900">
          Heatrace
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          AI usage intelligence
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="rounded-xl border border-gray-200 bg-white p-6 lg:col-span-2">
            <h2 className="text-lg font-medium text-gray-900">
              AI Usage
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Understand how your teams are using AI.
            </p>

            <div className="mt-6 flex h-80 items-center justify-center rounded-lg bg-gray-50">
              <p className="text-sm text-gray-400">
                Usage heatmap
              </p>
            </div>
          </section>

          <aside className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-medium text-gray-900">
              Signals
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Changes worth paying attention to.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}