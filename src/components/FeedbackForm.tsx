"use client";

import { useState } from "react";
import { ExperienceType, GenerateResponse, FeedbackAnswers } from "@/lib/types";

interface FeedbackFormProps {
  experienceType: ExperienceType;
  results: GenerateResponse;
  onSubmit: (answers: FeedbackAnswers) => void;
}

const QUESTIONS = [
  {
    id: "perceptionChange" as const,
    question: "Después de ver este análisis, ¿cambió la forma en que ves tu experiencia?",
    options: [
      "No, la veo igual.",
      "Un poco, descubrí cosas nuevas.",
      "Sí, ahora veo habilidades que antes no reconocía.",
      "Sí, cambió completamente la forma en que veo mi experiencia.",
    ],
  },
  {
    id: "mostValuable" as const,
    question: "¿Qué fue lo más valioso que descubriste?",
    options: [
      "Habilidades que no sabía que tenía.",
      "Una mejor forma de explicar mi experiencia.",
      "Mis fortalezas para mi futuro profesional.",
      "Nada nuevo.",
    ],
  },
  {
    id: "wouldUse" as const,
    question: "¿Usarías esta herramienta para ayudarte a prepararte profesionalmente?",
    options: [
      "No, no me sería útil.",
      "Tal vez, para analizar algunas experiencias.",
      "Sí, para mejorar mi CV o prepararme para entrevistas.",
      "Sí, sería una herramienta importante para mi desarrollo profesional.",
    ],
  },
];

export default function FeedbackForm({
  experienceType,
  results,
  onSubmit,
}: FeedbackFormProps) {
  const [answers, setAnswers] = useState<FeedbackAnswers>({
    perceptionChange: null,
    mostValuable: null,
    wouldUse: null,
  });

  const allAnswered =
    answers.perceptionChange !== null &&
    answers.mostValuable !== null &&
    answers.wouldUse !== null;

  const handleSelect = (
    questionId: keyof FeedbackAnswers,
    value: string
  ) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    if (!allAnswered) return;

    console.log("[METRIC] FEEDBACK_SUBMITTED", {
      perceptionChange: answers.perceptionChange,
      mostValuable: answers.mostValuable,
      wouldUse: answers.wouldUse,
      experienceType,
      results,
      timestamp: new Date().toISOString(),
    });

    onSubmit(answers);
  };

  return (
    <div className="mx-auto mt-8 w-full max-w-3xl">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h3 className="mb-1 text-lg font-bold text-slate-900">
          🚀 Ayúdanos a mejorar esta experiencia (30 segundos)
        </h3>
        <p className="mb-6 text-sm text-slate-500">
          Tu opinión nos ayudará a crear una herramienta que permita a más estudiantes descubrir y comunicar mejor el valor de sus experiencias.
        </p>

        <div className="space-y-6">
          {QUESTIONS.map((q) => (
            <div key={q.id}>
              <p className="mb-3 text-sm font-semibold text-slate-800">
                {q.question}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {q.options.map((option) => {
                  const isSelected = answers[q.id] === option;
                  return (
                    <button
                      key={option}
                      onClick={() => handleSelect(q.id, option)}
                      className={`rounded-xl px-4 py-3 text-left text-sm transition-all ${
                        isSelected
                          ? "border-2 border-primary-600 bg-primary-50 font-medium text-primary-700 shadow-sm"
                          : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="rounded-xl bg-primary-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
