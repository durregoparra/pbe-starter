export type ImpactValue = 0.25 | 0.5 | 1 | 2 | 3;
export type ConfidenceValue = 0.5 | 0.8 | 1;

export type FeatureStatus =
  | "idea"
  | "en_evaluacion"
  | "priorizada"
  | "en_desarrollo"
  | "lanzada";

export interface Feature {
  id: string;
  title: string;
  description: string;
  category: string;
  status: FeatureStatus;
  reach: number;
  impact: ImpactValue;
  confidence: ConfidenceValue;
  effort: number;
  createdAt: string;
}

export const IMPACT_OPTIONS: { value: ImpactValue; label: string }[] = [
  { value: 0.25, label: "Mínimo (0.25)" },
  { value: 0.5, label: "Bajo (0.5)" },
  { value: 1, label: "Medio (1)" },
  { value: 2, label: "Alto (2)" },
  { value: 3, label: "Masivo (3)" },
];

export const CONFIDENCE_OPTIONS: { value: ConfidenceValue; label: string }[] = [
  { value: 0.5, label: "Baja (0.5)" },
  { value: 0.8, label: "Media (0.8)" },
  { value: 1, label: "Alta (1.0)" },
];

export const STATUS_LABELS: Record<FeatureStatus, string> = {
  idea: "Idea",
  en_evaluacion: "En evaluación",
  priorizada: "Priorizada",
  en_desarrollo: "En desarrollo",
  lanzada: "Lanzada",
};

export function calculateRiceScore(
  reach: number,
  impact: number,
  confidence: number,
  effort: number,
): number {
  if (!(effort > 0)) return 0;
  return (reach * impact * confidence) / effort;
}
