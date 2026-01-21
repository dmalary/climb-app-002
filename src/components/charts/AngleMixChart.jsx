"use client";

import { useMemo, useRef, useState } from "react";

function degToRad(d) {
  return (d * Math.PI) / 180;
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

// angleDeg is your board angle (0..65) measured from vertical axis toward the slanted axis
function angleToDirection(angleDeg, maxAngleDeg, xAxisTiltFromHorizontalDeg = 25) {
  // Geometry:
  // - Vertical axis points up (SVG y-).
  // - Slanted axis is 25° above horizontal (to the right).
  //   That means it is 90 - 25 = 65° away from vertical.
  // So maxAngleDeg should match (90 - tilt) = 65.

  const wedgeDeg = 90 - xAxisTiltFromHorizontalDeg; // 65
  const t = clamp(angleDeg / maxAngleDeg, 0, 1);

  // Interpolate within wedge: 0° => vertical up, 65° => slanted axis
  const thetaFromVerticalDeg = t * wedgeDeg;

  // Convert to SVG direction:
  // Vertical up = -90° in standard unit circle? Easiest: build as vector from vertical.
  // Start vector is (0, -1). Rotate clockwise by thetaFromVertical.
  const th = degToRad(thetaFromVerticalDeg);
  const x = Math.sin(th);
  const y = -Math.cos(th);
  return { x, y, thetaFromVerticalDeg };
}

export default function AngleFanChart({
  data = [],              // [{ angle: Number, count: Number }]
  maxAngle = 65,          // board range
  height = 220,
  xAxisTilt = 25,         // degrees above horizontal
  title = "Angle mix",
}) {
  const wrapRef = useRef(null);
  const [hover, setHover] = useState(null); // { d, x, y }

  const cleaned = useMemo(() => {
    const arr = (data || [])
      .filter(d => d?.angle != null)
      .map(d => ({ angle: Number(d.angle), count: Number(d.count ?? 0) }))
      .filter(d => Number.isFinite(d.angle) && Number.isFinite(d.count))
      .sort((a, b) => a.angle - b.angle);
    return arr;
  }, [data]);

  const maxCount = useMemo(
    () => cleaned.reduce((m, d) => Math.max(m, d.count), 0),
    [cleaned]
  );

  if (!cleaned.length) return null;

  // SVG layout
  const W = 420;              // viewBox width (responsive)
  const H = 260;              // viewBox height
  const origin = { x: 80, y: 220 }; // fan origin (left-ish, bottom-ish)
  const rMin = 30;
  const rMax = 160;

  // Axes directions
  const vertical = { x: 0, y: -1 };
  const xAxisDir = (() => {
    // 25° above horizontal to the right
    const th = degToRad(-xAxisTilt); // negative because SVG y down
    return { x: Math.cos(th), y: Math.sin(th) };
  })();

  const scaleR = (count) => {
    if (!maxCount) return rMin;
    // nicer than linear; keeps small counts visible
    const t = Math.sqrt(count / maxCount);
    return rMin + t * (rMax - rMin);
  };

  const onMove = (evt, d) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setHover({
      d,
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    });
  };

  const clearHover = () => setHover(null);


  // increase size + add lines for the 5's
  return (
    <div ref={wrapRef} className="relative w-full">
      <div className="mb-2 flex items-baseline justify-between">
        <div className="text-xs text-stone-400">{title}</div>
        <div className="text-[11px] text-stone-500">
          {cleaned.length} angles • max {maxAngle}°
        </div>
      </div>

      <div className="w-full" style={{ height }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
          {/* Background wedge guide (optional subtle arc) */}
          {/* Axes */}
          <line
            x1={origin.x} y1={origin.y}
            x2={origin.x + vertical.x * rMax} y2={origin.y + vertical.y * rMax}
            stroke="rgba(120,120,120,0.6)"
            strokeWidth="2"
          />
          <line
            x1={origin.x} y1={origin.y}
            x2={origin.x + xAxisDir.x * rMax} y2={origin.y + xAxisDir.y * rMax}
            stroke="rgba(120,120,120,0.6)"
            strokeWidth="2"
          />

          {/* Axis labels */}
          <text
            x={origin.x - 8}
            y={origin.y + vertical.y * (rMax + 10)}
            fontSize="12"
            fill="rgba(180,180,180,0.9)"
            textAnchor="end"
          >
            0°
          </text>
          <text
            x={origin.x + xAxisDir.x * (rMax + 12)}
            y={origin.y + xAxisDir.y * (rMax + 12)}
            fontSize="12"
            fill="rgba(180,180,180,0.9)"
            textAnchor="start"
          >
            {maxAngle}°
          </text>

          {/* Tick rays every 10° */}
          {Array.from({ length: Math.floor(maxAngle / 10) + 1 }, (_, i) => i * 10).map((a) => {
            const dir = angleToDirection(a, maxAngle, xAxisTilt);
            const rx = origin.x + dir.x * (rMax * 0.95);
            const ry = origin.y + dir.y * (rMax * 0.95);
            return (
              <g key={`tick-${a}`}>
                <line
                  x1={origin.x} y1={origin.y}
                  x2={rx} y2={ry}
                  stroke="rgba(120,120,120,0.25)"
                  strokeWidth="1"
                />
                <text
                  x={origin.x + dir.x * (rMax * 1.02)}
                  y={origin.y + dir.y * (rMax * 1.02)}
                  fontSize="10"
                  fill="rgba(160,160,160,0.65)"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {a}°
                </text>
              </g>
            );
          })}

          {/* Rays for climbed angles */}
          {cleaned.map((d) => {
            const dir = angleToDirection(d.angle, maxAngle, xAxisTilt);
            const r = scaleR(d.count);

            const x2 = origin.x + dir.x * r;
            const y2 = origin.y + dir.y * r;

            const isHot = hover?.d?.angle === d.angle;

            return (
              <g
                key={`ray-${d.angle}`}
                onMouseMove={(e) => onMove(e, d)}
                onMouseEnter={(e) => onMove(e, d)}
                onMouseLeave={clearHover}
                style={{ cursor: "default" }}
              >
                <line
                  x1={origin.x} y1={origin.y}
                  x2={x2} y2={y2}
                  stroke={isHot ? "rgba(34,197,94,1)" : "rgba(34,197,94,0.65)"}
                  strokeWidth={isHot ? 4 : 3}
                  strokeLinecap="round"
                />
                {/* end dot */}
                <circle
                  cx={x2}
                  cy={y2}
                  r={isHot ? 5 : 4}
                  fill={isHot ? "rgba(34,197,94,1)" : "rgba(34,197,94,0.8)"}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Tooltip */}
      {hover && (
        <div
          className="pointer-events-none absolute z-20 rounded-md border border-stone-700 bg-stone-900/95 px-3 py-2 text-xs text-stone-100 shadow-lg"
          style={{
            left: hover.x + 10,
            top: hover.y - 10,
            transform: "translateY(-100%)",
            width: 160,
          }}
        >
          <div className="font-medium text-stone-200">{hover.d.angle}°</div>
          <div className="mt-1 text-stone-300">
            <span className="text-stone-400">Count:</span> {hover.d.count}
          </div>
        </div>
      )}
    </div>
  );
}
