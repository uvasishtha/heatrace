"use client";

import { useState } from "react";

const RANGES = ["Last 24 hours", "Last 7 days", "Last 30 days"];

export default function DashboardHeader() {
  const [range, setRange] = useState(RANGES[1]);
  const [open, setOpen] = useState(false);

  return (
    <header className="flex items-end justify-between">
      <div>
        <p className="eyebrow">Deployment intelligence</p>

        <h1 className="mt-1 font-serif text-5xl italic tracking-tight text-bone">
          Heatrace<span className="text-spark">.</span>
        </h1>
      </div>

      <div className="relative">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="group flex items-center gap-2 border border-line px-3.5 py-2 text-xs uppercase tracking-wide text-ash transition-colors hover:border-line-bright hover:text-bone"
        >
          {range}
          <span className="text-ember transition-transform group-hover:translate-y-0.5">
            {open ? "−" : "+"}
          </span>
        </button>

        {open && (
          <div className="absolute right-0 z-10 mt-1 w-44 border border-line bg-char">
            {RANGES.map((option) => (
              <button
                key={option}
                onClick={() => {
                  setRange(option);
                  setOpen(false);
                }}
                className={`block w-full border-l-2 px-3.5 py-2 text-left text-xs uppercase tracking-wide transition-colors ${
                  option === range
                    ? "border-ember text-bone"
                    : "border-transparent text-ash hover:border-line-bright hover:text-bone"
                }`}
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
