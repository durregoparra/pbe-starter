import FeaturesPage from "@/components/FeaturesPage";
import type { Feature } from "@/lib/rice";
import { supabase } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data, error } = await supabase
    .from("features")
    .select("*")
    .order("created_at", { ascending: true });

  const features: Feature[] = (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    status: row.status,
    reach: row.reach,
    impact: row.impact,
    confidence: row.confidence,
    effort: row.effort,
  }));

  return (
    <FeaturesPage
      initialFeatures={features}
      loadError={
        error ? "No se pudieron cargar las features. Intenta recargar la página." : null
      }
    />
  );
}
