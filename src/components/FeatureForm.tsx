"use client";

import { useState, type FormEvent } from "react";
import {
  CONFIDENCE_OPTIONS,
  IMPACT_OPTIONS,
  calculateRiceScore,
  type ConfidenceValue,
  type Feature,
  type ImpactValue,
} from "@/lib/rice";
import { supabase } from "@/lib/supabase/client";

interface FormValues {
  title: string;
  description: string;
  category: string;
  reach: string;
  impact: string;
  confidence: string;
  effort: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  title: "",
  description: "",
  category: "",
  reach: "",
  impact: "1",
  confidence: "0.8",
  effort: "",
};

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.title.trim()) {
    errors.title = "El título es obligatorio.";
  }

  if (!values.description.trim()) {
    errors.description = "La descripción es obligatoria.";
  }

  if (!values.category.trim()) {
    errors.category = "La categoría es obligatoria.";
  }

  const reach = Number(values.reach);
  if (!values.reach.trim()) {
    errors.reach = "El reach es obligatorio.";
  } else if (!Number.isFinite(reach) || reach <= 0) {
    errors.reach = "Ingresa un número mayor a 0.";
  }

  const effort = Number(values.effort);
  if (!values.effort.trim()) {
    errors.effort = "El esfuerzo es obligatorio.";
  } else if (!Number.isFinite(effort) || effort <= 0) {
    errors.effort = "Ingresa un esfuerzo mayor a 0.";
  }

  return errors;
}

export default function FeatureForm({
  onAdd,
}: {
  onAdd: (feature: Feature) => void;
}) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const reachNumber = Number(values.reach);
  const effortNumber = Number(values.effort);
  const canPreview =
    values.reach.trim() !== "" &&
    values.effort.trim() !== "" &&
    Number.isFinite(reachNumber) &&
    Number.isFinite(effortNumber) &&
    effortNumber > 0;

  const previewScore = canPreview
    ? calculateRiceScore(
        reachNumber,
        Number(values.impact),
        Number(values.confidence),
        effortNumber,
      )
    : null;

  function handleChange<K extends keyof FormValues>(field: K, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);

    const { data, error } = await supabase
      .from("features")
      .insert({
        title: values.title.trim(),
        description: values.description.trim(),
        category: values.category.trim(),
        reach: reachNumber,
        impact: Number(values.impact),
        confidence: Number(values.confidence),
        effort: effortNumber,
      })
      .select()
      .single();

    setSubmitting(false);

    if (error || !data) {
      setSubmitError("No se pudo guardar la feature. Intenta de nuevo.");
      return;
    }

    onAdd({
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category,
      status: data.status,
      reach: data.reach,
      impact: data.impact as ImpactValue,
      confidence: data.confidence as ConfidenceValue,
      effort: data.effort,
      createdAt: data.created_at,
    });

    setValues(initialValues);
    setErrors({});
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex w-full flex-col gap-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8"
    >
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Nueva feature
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Captura una idea y su puntaje RICE para priorizarla.
        </p>
      </div>

      <Field label="Título" htmlFor="title" error={errors.title}>
        <input
          id="title"
          type="text"
          value={values.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Ej: Onboarding guiado para nuevos usuarios"
          className={inputClass(Boolean(errors.title))}
        />
      </Field>

      <Field label="Descripción" htmlFor="description" error={errors.description}>
        <textarea
          id="description"
          value={values.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="¿Qué problema resuelve esta feature?"
          rows={3}
          className={inputClass(Boolean(errors.description))}
        />
      </Field>

      <Field label="Categoría" htmlFor="category" error={errors.category}>
        <input
          id="category"
          type="text"
          value={values.category}
          onChange={(e) => handleChange("category", e.target.value)}
          placeholder="Ej: onboarding, checkout"
          className={inputClass(Boolean(errors.category))}
        />
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          label="Reach"
          htmlFor="reach"
          error={errors.reach}
          hint="Personas alcanzadas por trimestre"
        >
          <input
            id="reach"
            type="number"
            min="1"
            step="1"
            value={values.reach}
            onChange={(e) => handleChange("reach", e.target.value)}
            placeholder="Ej: 1500"
            className={inputClass(Boolean(errors.reach))}
          />
        </Field>

        <Field
          label="Esfuerzo"
          htmlFor="effort"
          error={errors.effort}
          hint="Persona-meses"
        >
          <input
            id="effort"
            type="number"
            min="0.1"
            step="0.1"
            value={values.effort}
            onChange={(e) => handleChange("effort", e.target.value)}
            placeholder="Ej: 2"
            className={inputClass(Boolean(errors.effort))}
          />
        </Field>

        <Field label="Impact" htmlFor="impact">
          <select
            id="impact"
            value={values.impact}
            onChange={(e) => handleChange("impact", e.target.value)}
            className={inputClass(false)}
          >
            {IMPACT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Confidence" htmlFor="confidence">
          <select
            id="confidence"
            value={values.confidence}
            onChange={(e) => handleChange("confidence", e.target.value)}
            className={inputClass(false)}
          >
            {CONFIDENCE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-zinc-50 px-4 py-3 dark:bg-zinc-800/50">
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          Score RICE
        </span>
        <span className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          {previewScore === null ? "—" : previewScore.toFixed(1)}
        </span>
      </div>

      {submitError ? (
        <p className="text-sm text-red-600 dark:text-red-400">{submitError}</p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {submitting ? "Guardando..." : "Guardar feature"}
      </button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : hint ? (
        <p className="text-sm text-zinc-400 dark:text-zinc-500">{hint}</p>
      ) : null}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return [
    "w-full rounded-lg border bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors",
    "dark:bg-zinc-950 dark:text-zinc-50",
    "focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-50/20",
    hasError
      ? "border-red-400 focus:border-red-500 dark:border-red-500/60"
      : "border-zinc-200 focus:border-zinc-400 dark:border-zinc-700 dark:focus:border-zinc-500",
  ].join(" ");
}
