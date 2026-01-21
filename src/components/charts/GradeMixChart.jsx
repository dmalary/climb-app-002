"use client";

import { useMemo, useState } from "react";

function clamp01(x) {
  return Math.max(0, Math.min(1, x));
}

// Map count -> opacity (or intensity)
function intensity(count, max) {
  if (!max) return 0.15;
  // sqrt gives nicer scaling when counts are skewed
  return 0.15 + 0.85 * Math.sqrt(count / max);
}

export default function GradeMixHeatmap({ data = [] }) {
  const [hovered, setHovered] = useState(null);

  const { maxCount, total } = useMemo(() => {
    const maxCount = data.reduce((m, d) => Math.max(m, d.count || 0), 0);
    const total = data.reduce((s, d) => s + (d.count || 0), 0);
    return { maxCount, total };
  }, [data]);

  if (!data.length) return null;

  return (
    <div className="w-full">
      <div className="mb-2 flex items-baseline justify-between">
        <div className="text-xs text-stone-400">Grade mix</div>
        <div className="text-[11px] text-stone-500">{total} total</div>
      </div>

      <div className="grid grid-cols-6 gap-2">
        {data.map((d) => {
          const a = intensity(d.count || 0, maxCount);
          const isActive = hovered?.grade === d.grade;

          return (
            <div key={d.grade} className="relative">
              <button
                type="button"
                onMouseEnter={() => setHovered(d)}
                onMouseLeave={() => setHovered(null)}
                className={[
                  "w-full rounded-md border border-stone-700/60 p-2 text-left",
                  "bg-stone-900/40 hover:border-stone-500/70 transition",
                  isActive ? "ring-1 ring-stone-400/60" : "",
                ].join(" ")}
                style={{
                  // Keep color consistent with your palette but use opacity as “heat”
                  backgroundColor: `rgba(34, 197, 94, ${clamp01(a)})`,
                }}
              >
                <div className="text-xs font-medium text-stone-100">{d.grade}</div>
                <div className="mt-1 text-[11px] text-stone-200/90">{d.count}</div>
              </button>

              {/* Tooltip */}
              {isActive && (
                <div className="pointer-events-none absolute z-20 -top-2 left-1/2 w-44 -translate-x-1/2 -translate-y-full rounded-md border border-stone-700 bg-stone-900/95 px-3 py-2 text-xs text-stone-100 shadow-lg">
                  <div className="font-medium text-stone-200">{d.grade}</div>
                  <div className="mt-1 text-stone-300">
                    <span className="text-stone-400">Attempts:</span> {d.count}
                  </div>
                  {total ? (
                    <div className="text-stone-300">
                      <span className="text-stone-400">Share:</span>{" "}
                      {Math.round((d.count / total) * 100)}%
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-2 text-[11px] text-stone-500">
        Darker = more attempts at that grade.
      </div>
    </div>
  );
}
