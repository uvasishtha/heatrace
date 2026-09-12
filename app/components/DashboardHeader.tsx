"use client";

import { useState } from "react";

const RANGES = ["Last 7 days", "Last 30 days", "Last 90 days"];

export default function DashboardHeader() {
  const [range, setRange] = useState(RANGES[1]);
  const [open, setOpen] = useState(false);

  return (
    <header className="flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Heatrace</h1>

        <p className="mt-1 text-sm text-gray-500">AI usage intelligence</p>
      </div>

      <div className="relative">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50"
        >
          {range}
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-40 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
            {RANGES.map((option) => (
              <button
                key={option}
                onClick={() => {
                  setRange(option);
                  setOpen(false);
                }}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
