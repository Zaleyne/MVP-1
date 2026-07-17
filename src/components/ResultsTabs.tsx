"use client";

import { useState } from "react";
import { GenerateResponse } from "@/lib/types";
import CopyButton from "./CopyButton";
import RegenerateButton from "./RegenerateButton";

interface ResultsTabsProps {
  results: GenerateResponse;
  onRegenerate: () => void;
  isRegenerating: boolean;
  onCopy?: () => void;
  feedbackSlot?: React.ReactNode;
}

export default function ResultsTabs({
  results,
  onRegenerate,
  isRegenerating,
  onCopy,
  feedbackSlot,
}: ResultsTabsProps) {
  const [activeTab, setActiveTab] = useState<"cv" | "star">("cv");

  return (
    <div className="mx-auto w-full max-w-3xl">
      <h2 className="mb-2 text-center text-2xl font-bold text-slate-900">
        Tu evidencia profesional
      </h2>
      <p className="mb-8 text-center text-sm text-slate-500">
        Copia y usa estos resultados en tu búsqueda de empleo
      </p>

      <div className="mb-6 flex justify-center gap-2">
        <button
          onClick={() => setActiveTab("cv")}
          className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
            activeTab === "cv"
              ? "bg-primary-600 text-white shadow-md shadow-primary-600/20"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          📄 Logros para CV
        </button>
        <button
          onClick={() => setActiveTab("star")}
          className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
            activeTab === "star"
              ? "bg-primary-600 text-white shadow-md shadow-primary-600/20"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          🎤 Respuesta STAR
        </button>
      </div>

      {activeTab === "cv" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">
              Logros para CV
            </h3>
            <div className="flex gap-2">
              <RegenerateButton onClick={onRegenerate} isLoading={isRegenerating} />
              <CopyButton text={results.cvBullets} onCopy={onCopy} />
            </div>
          </div>
          <div className="whitespace-pre-line rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
            {results.cvBullets}
          </div>
          <p className="mt-4 rounded-lg bg-primary-50 p-3 text-xs text-primary-700">
            💡 Estos bullet points usan verbos de acción fuertes y están optimizados para sistemas ATS. Cada línea destaca un logro específico con métricas cuando es posible.
          </p>
        </div>
      )}

      {activeTab === "star" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">
              Respuesta STAR para entrevista
            </h3>
            <div className="flex gap-2">
              <RegenerateButton onClick={onRegenerate} isLoading={isRegenerating} />
              <CopyButton text={results.starAnswer} onCopy={onCopy} />
            </div>
          </div>
          <div className="whitespace-pre-line rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
            {results.starAnswer}
          </div>
          <p className="mt-4 rounded-lg bg-primary-50 p-3 text-xs text-primary-700">
            💡 Esta respuesta sigue la estructura STAR (Situación, Tarea, Acción, Resultado). Practícala para que suene natural en tu entrevista, pero no la memorices palabra por palabra.
          </p>
        </div>
      )}

      {feedbackSlot}

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h4 className="mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
          ¿Por qué es efectivo?
        </h4>
        <p className="text-sm leading-relaxed text-slate-600">
          {results.explanation}
        </p>
      </div>
    </div>
  );
}
