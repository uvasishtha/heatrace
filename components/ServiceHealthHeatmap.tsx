"use client";

import Link from "next/link";
import { Fragment } from "react";
import { serviceHeatmapData, healthDays, healthClass, healthLabel } from "@/app/lib/deployment-data";

export default function ServiceHealthHeatmap() {
  return (
    <section className="border border-line bg-char p-6 lg:col-span-2">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="eyebrow">Five-day view</p>
          <h2 className="mt-1 font-serif text-2xl italic text-bone">
            Service Health
          </h2>
        </div>

        <p className="max-w-[16rem] text-right text-xs text-ash-dim">
          Service health scores across the week. Lower scores indicate degradation.
        </p>
      </div>

      <div className="mt-6 overflow-x-auto">
        <div className="min-w-max">
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: `120px repeat(${healthDays.length}, 1fr)`,
            }}
          >
            <div />

            {healthDays.map((day) => (
              <div
                key={day}
                className="text-center text-[10px] text-ash-dim"
              >
                {day}
              </div>
            ))}

            {serviceHeatmapData.map((service) => (
              <Fragment key={service.id || service.service}>
                <Link
                  href={`/services/${service.id || service.service}`}
                  className="flex items-center text-sm text-ash hover:text-bone transition-colors pr-2"
                >
                  {service.name || service.service}
                </Link>

                {(service.health || []).map((health, idx) => (
                  <Link
                    key={`${(service.id || service.service)}-${idx}`}
                    href={`/services/${service.id || service.service}?day=${healthDays[idx]}`}
                    aria-label={`View ${service.name || service.service} health on ${healthDays[idx]}`}
                    title={`${service.name || service.service} · ${healthDays[idx]} · ${healthLabel(health)}`}
                    className={`h-6 w-6 transition-transform hover:scale-125 hover:ring-1 hover:ring-bone/50 ${healthClass(health)}`}
                  />
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-xs text-ash-dim">
        <span>Critical</span>
        <div className="h-3 w-3 bg-char-2" />
        <div className="h-3 w-3 bg-crimson" />
        <div className="h-3 w-3 bg-burnt" />
        <div className="h-3 w-3 bg-ember" />
        <div className="h-3 w-3 bg-spark" />
        <span>Healthy</span>
      </div>
    </section>
  );
}