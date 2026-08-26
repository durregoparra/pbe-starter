import { calculateRiceScore, STATUS_LABELS, type Feature } from "@/lib/rice";

export default function FeatureList({ features }: { features: Feature[] }) {
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

  const sorted = [...features].sort(
    (a, b) =>
      calculateRiceScore(b.reach, b.impact, b.confidence, b.effort) -
      calculateRiceScore(a.reach, a.impact, a.confidence, a.effort),
  );

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        Features capturadas ({features.length})
      </h2>
      <ul className="flex flex-col gap-3">
        {sorted.map((feature) => {
          const score = calculateRiceScore(
            feature.reach,
            feature.impact,
            feature.confidence,
            feature.effort,
          );
          return (
            <li
              key={feature.id}
              className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium text-zinc-900 dark:text-zinc-50">
                      {feature.title}
                    </h3>
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      {feature.category}
                    </span>
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                      {STATUS_LABELS[feature.status]}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
                    {feature.description}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    {score.toFixed(1)}
                  </div>
                  <div className="text-xs text-zinc-400 dark:text-zinc-500">
                    RICE
                  </div>
                </div>
              </div>

              <dl className="grid grid-cols-4 gap-2 border-t border-zinc-100 pt-3 text-center dark:border-zinc-800">
                <div>
                  <dt className="text-xs text-zinc-400 dark:text-zinc-500">
                    Reach
                  </dt>
                  <dd className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                    {feature.reach}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-zinc-400 dark:text-zinc-500">
                    Impact
                  </dt>
                  <dd className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                    {feature.impact}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-zinc-400 dark:text-zinc-500">
                    Confidence
                  </dt>
                  <dd className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                    {feature.confidence}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-zinc-400 dark:text-zinc-500">
                    Effort
                  </dt>
                  <dd className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                    {feature.effort}
                  </dd>
                </div>
              </dl>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
