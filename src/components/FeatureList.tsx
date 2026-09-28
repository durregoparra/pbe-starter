"use client";

import { useMemo, useRef, useState } from "react";
import { calculateRiceScore, STATUS_LABELS, type Feature } from "@/lib/rice";

type SortOrder = "asc" | "desc";

const dateFormatter = new Intl.DateTimeFormat("es", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export default function FeatureList({ features }: { features: Feature[] }) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const rankingDialogRef = useRef<HTMLDialogElement>(null);

  const sorted = useMemo(() => {
    const byDateAsc = [...features].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
    return sortOrder === "asc" ? byDateAsc : byDateAsc.reverse();
  }, [features, sortOrder]);

  const ranked = useMemo(() => {
    return [...features].sort(
      (a, b) =>
        calculateRiceScore(b.reach, b.impact, b.confidence, b.effort) -
        calculateRiceScore(a.reach, a.impact, a.confidence, a.effort),
    );
  }, [features]);

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

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Features capturadas ({features.length})
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
            Ordenar por
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-sm text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-500"
            >
              <option value="asc">Más viejas primero</option>
              <option value="desc">Más nuevas primero</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() => rankingDialogRef.current?.showModal()}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Ver ranking RICE
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
            <tr>
              <th className="px-6 py-3 font-medium">Feature</th>
              <th className="px-6 py-3 font-medium whitespace-nowrap">Estado</th>
              <th className="px-6 py-3 font-medium">RICE</th>
              <th className="px-6 py-3 font-medium text-right whitespace-nowrap">Score</th>
              <th className="px-6 py-3 font-medium whitespace-nowrap">Creada</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {sorted.map((feature) => {
              const score = calculateRiceScore(
                feature.reach,
                feature.impact,
                feature.confidence,
                feature.effort,
              );
              return (
                <tr key={feature.id} className="bg-white align-top dark:bg-zinc-900">
                  <td className="px-6 py-4">
                    <div className="font-medium text-zinc-900 dark:text-zinc-50">
                      {feature.title}
                    </div>
                    <span className="mt-1.5 inline-block rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      {feature.category}
                    </span>
                    <p className="mt-1.5 line-clamp-2 max-w-sm text-xs text-zinc-500 dark:text-zinc-400">
                      {feature.description}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                      {STATUS_LABELS[feature.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-600 dark:text-zinc-300">
                      <span>
                        <span className="text-zinc-400 dark:text-zinc-500">R</span>{" "}
                        <span className="font-medium">{feature.reach}</span>
                      </span>
                      <span>
                        <span className="text-zinc-400 dark:text-zinc-500">I</span>{" "}
                        <span className="font-medium">{feature.impact}</span>
                      </span>
                      <span>
                        <span className="text-zinc-400 dark:text-zinc-500">C</span>{" "}
                        <span className="font-medium">{feature.confidence}</span>
                      </span>
                      <span>
                        <span className="text-zinc-400 dark:text-zinc-500">E</span>{" "}
                        <span className="font-medium">{feature.effort}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold whitespace-nowrap text-zinc-900 dark:text-zinc-50">
                    {score.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-zinc-500 dark:text-zinc-400">
                    {dateFormatter.format(new Date(feature.createdAt))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <dialog
        ref={rankingDialogRef}
        onClick={(e) => {
          if (e.target === rankingDialogRef.current) {
            rankingDialogRef.current?.close();
          }
        }}
        className="m-auto w-[90vw] max-w-lg rounded-2xl border border-zinc-200 bg-white p-0 text-zinc-900 shadow-xl backdrop:bg-black/40 backdrop:backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
      >
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <h3 className="text-base font-semibold">Ranking por Score RICE</h3>
          <button
            type="button"
            onClick={() => rankingDialogRef.current?.close()}
            aria-label="Cerrar"
            className="rounded-full p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            ✕
          </button>
        </div>
        <ol className="max-h-[70vh] divide-y divide-zinc-100 overflow-y-auto dark:divide-zinc-800">
          {ranked.map((feature, index) => {
            const score = calculateRiceScore(
              feature.reach,
              feature.impact,
              feature.confidence,
              feature.effort,
            );
            return (
              <li
                key={feature.id}
                className="flex items-center justify-between gap-4 px-6 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-zinc-900 dark:text-zinc-50">
                      {feature.title}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {feature.category}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 font-semibold text-zinc-900 dark:text-zinc-50">
                  {score.toFixed(1)}
                </span>
              </li>
            );
          })}
        </ol>
      </dialog>
    </div>
  );
}
