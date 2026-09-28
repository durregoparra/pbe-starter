"use client";

import { useState } from "react";
import FeatureForm from "@/components/FeatureForm";
import FeatureList from "@/components/FeatureList";
import FeatureMatrix from "@/components/FeatureMatrix";
import type { Feature } from "@/lib/rice";

type View = "lista" | "matriz";

export default function FeaturesPage({
  initialFeatures,
  loadError,
}: {
  initialFeatures: Feature[];
  loadError: string | null;
}) {
  const [features, setFeatures] = useState<Feature[]>(initialFeatures);
  const [view, setView] = useState<View>("lista");

  return (
    <main className="flex flex-1 flex-col items-center gap-10 bg-white px-4 py-12 dark:bg-zinc-950">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Priorizador de Features
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Captura ideas y calcula su puntaje RICE
        </p>
      </div>

      {loadError ? (
        <p className="w-full max-w-6xl rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
          {loadError}
        </p>
      ) : null}

      <div className="grid w-full max-w-6xl grid-cols-1 items-start gap-8 md:grid-cols-[380px_minmax(0,1fr)]">
        <div className="md:sticky md:top-12">
          <FeatureForm
            onAdd={(feature) => setFeatures((prev) => [...prev, feature])}
          />
        </div>
        <div className="flex flex-col gap-4">
          <div className="inline-flex w-fit rounded-lg border border-zinc-200 bg-zinc-50 p-1 text-sm dark:border-zinc-800 dark:bg-zinc-900">
            <button
              type="button"
              onClick={() => setView("lista")}
              className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
                view === "lista"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-50"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              }`}
            >
              Lista
            </button>
            <button
              type="button"
              onClick={() => setView("matriz")}
              className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
                view === "matriz"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-50"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              }`}
            >
              Matriz
            </button>
          </div>

          {view === "lista" ? (
            <FeatureList features={features} />
          ) : (
            <FeatureMatrix features={features} />
          )}
        </div>
      </div>
    </main>
  );
}
