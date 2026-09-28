"use client";

import { useState } from "react";
import { calculateRiceScore, type Feature } from "@/lib/rice";

const VIEW_WIDTH = 640;
const VIEW_HEIGHT = 420;
const PADDING = { top: 24, right: 24, bottom: 56, left: 56 };

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

export default function FeatureMatrix({ features }: { features: Feature[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (features.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-200 p-8 text-center dark:border-zinc-800">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Aún no has capturado ninguna feature. Usa el formulario para agregar
          la primera.
        </p>
      </div>
    );
  }

  const efforts = features.map((f) => f.effort);
  const impacts = features.map((f) => f.impact);
  const effortMedian = median(efforts);
  const impactMedian = median(impacts);

  const xMax = Math.max(...efforts) * 1.15;
  const yMax = Math.max(3, ...impacts) * 1.15;

  const plotLeft = PADDING.left;
  const plotTop = PADDING.top;
  const plotWidth = VIEW_WIDTH - PADDING.left - PADDING.right;
  const plotHeight = VIEW_HEIGHT - PADDING.top - PADDING.bottom;

  const scaleX = (effort: number) => plotLeft + (effort / xMax) * plotWidth;
  const scaleY = (impact: number) => plotTop + plotHeight - (impact / yMax) * plotHeight;

  const dividerX = scaleX(effortMedian);
  const dividerY = scaleY(impactMedian);

  const points = features.map((feature) => ({
    feature,
    cx: scaleX(feature.effort),
    cy: scaleY(feature.impact),
    score: calculateRiceScore(
      feature.reach,
      feature.impact,
      feature.confidence,
      feature.effort,
    ),
  }));

  const hovered = points.find((p) => p.feature.id === hoveredId) ?? null;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Cada punto es una feature ubicada según su impacto y esfuerzo. Las
        líneas punteadas dividen el backlog en cuadrantes según la mediana
        actual de impacto y esfuerzo.
      </p>

      <div
        className="relative w-full overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
        style={{ aspectRatio: `${VIEW_WIDTH} / ${VIEW_HEIGHT}` }}
      >
        <svg
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          className="h-full w-full"
          role="img"
          aria-label="Matriz de impacto vs. esfuerzo"
        >
          <rect
            x={plotLeft}
            y={plotTop}
            width={dividerX - plotLeft}
            height={dividerY - plotTop}
            className="fill-emerald-50 dark:fill-emerald-500/10"
          />
          <rect
            x={dividerX}
            y={plotTop}
            width={plotLeft + plotWidth - dividerX}
            height={dividerY - plotTop}
            className="fill-blue-50 dark:fill-blue-500/10"
          />
          <rect
            x={plotLeft}
            y={dividerY}
            width={dividerX - plotLeft}
            height={plotTop + plotHeight - dividerY}
            className="fill-zinc-50 dark:fill-zinc-800/40"
          />
          <rect
            x={dividerX}
            y={dividerY}
            width={plotLeft + plotWidth - dividerX}
            height={plotTop + plotHeight - dividerY}
            className="fill-rose-50 dark:fill-rose-500/10"
          />

          <text
            x={plotLeft + 10}
            y={plotTop + 18}
            className="fill-emerald-700 text-[11px] font-semibold tracking-wide uppercase dark:fill-emerald-300"
          >
            Quick Wins
          </text>
          <text
            x={plotLeft + plotWidth - 10}
            y={plotTop + 18}
            textAnchor="end"
            className="fill-blue-700 text-[11px] font-semibold tracking-wide uppercase dark:fill-blue-300"
          >
            Big Bets
          </text>
          <text
            x={plotLeft + 10}
            y={plotTop + plotHeight - 8}
            className="fill-zinc-500 text-[11px] font-semibold tracking-wide uppercase dark:fill-zinc-400"
          >
            Fill-ins
          </text>
          <text
            x={plotLeft + plotWidth - 10}
            y={plotTop + plotHeight - 8}
            textAnchor="end"
            className="fill-rose-700 text-[11px] font-semibold tracking-wide uppercase dark:fill-rose-300"
          >
            Time Sinks
          </text>

          <line
            x1={dividerX}
            y1={plotTop}
            x2={dividerX}
            y2={plotTop + plotHeight}
            className="stroke-zinc-300 dark:stroke-zinc-600"
            strokeWidth={1.5}
            strokeDasharray="5 5"
          />
          <line
            x1={plotLeft}
            y1={dividerY}
            x2={plotLeft + plotWidth}
            y2={dividerY}
            className="stroke-zinc-300 dark:stroke-zinc-600"
            strokeWidth={1.5}
            strokeDasharray="5 5"
          />

          <line
            x1={plotLeft}
            y1={plotTop}
            x2={plotLeft}
            y2={plotTop + plotHeight}
            className="stroke-zinc-400 dark:stroke-zinc-600"
            strokeWidth={1.5}
          />
          <line
            x1={plotLeft}
            y1={plotTop + plotHeight}
            x2={plotLeft + plotWidth}
            y2={plotTop + plotHeight}
            className="stroke-zinc-400 dark:stroke-zinc-600"
            strokeWidth={1.5}
          />

          <text
            x={plotLeft + plotWidth / 2}
            y={VIEW_HEIGHT - 16}
            textAnchor="middle"
            className="fill-zinc-500 text-xs dark:fill-zinc-400"
          >
            Esfuerzo (persona-meses) →
          </text>
          <text
            x={16}
            y={plotTop + plotHeight / 2}
            textAnchor="middle"
            transform={`rotate(-90, 16, ${plotTop + plotHeight / 2})`}
            className="fill-zinc-500 text-xs dark:fill-zinc-400"
          >
            Impacto →
          </text>

          {points.map(({ feature, cx, cy }) => (
            <g key={feature.id}>
              <circle
                cx={cx}
                cy={cy}
                r={14}
                fill="transparent"
                className="cursor-pointer"
                tabIndex={0}
                onMouseEnter={() => setHoveredId(feature.id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setHoveredId(feature.id)}
                onBlur={() => setHoveredId(null)}
              />
              <circle
                cx={cx}
                cy={cy}
                r={hoveredId === feature.id ? 7 : 6}
                strokeWidth={2}
                style={{ pointerEvents: "none" }}
                className="fill-blue-600 stroke-white transition-[r] dark:fill-blue-400 dark:stroke-zinc-900"
              />
            </g>
          ))}
        </svg>

        {hovered ? (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs whitespace-nowrap shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
            style={{
              left: `${(hovered.cx / VIEW_WIDTH) * 100}%`,
              top: `${(hovered.cy / VIEW_HEIGHT) * 100}%`,
            }}
          >
            <p className="font-semibold text-zinc-900 dark:text-zinc-50">
              {hovered.feature.title}
            </p>
            <p className="mt-0.5 text-zinc-500 dark:text-zinc-400">
              Impacto {hovered.feature.impact} · Esfuerzo{" "}
              {hovered.feature.effort} · Score {hovered.score.toFixed(1)}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
