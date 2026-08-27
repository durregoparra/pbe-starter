"use client";

import { useState } from "react";
import FeatureForm from "@/components/FeatureForm";
import FeatureList from "@/components/FeatureList";
import type { Feature } from "@/lib/rice";

export default function FeaturesPage({
  initialFeatures,
  loadError,
}: {
  initialFeatures: Feature[];
  loadError: string | null;
}) {
  const [features, setFeatures] = useState<Feature[]>(initialFeatures);

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
        <p className="w-full max-w-4xl rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
          {loadError}
        </p>
      ) : null}

      <div className="grid w-full max-w-4xl grid-cols-1 items-start gap-8 md:grid-cols-[380px_minmax(0,1fr)]">
        <div className="md:sticky md:top-12">
          <FeatureForm
            onAdd={(feature) => setFeatures((prev) => [...prev, feature])}
          />
        </div>
        <FeatureList features={features} />
      </div>
    </main>
  );
}
