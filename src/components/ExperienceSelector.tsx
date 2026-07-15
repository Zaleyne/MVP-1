"use client";

import { ExperienceType, EXPERIENCE_OPTIONS } from "@/lib/types";

interface ExperienceSelectorProps {
  onSelect: (type: ExperienceType, custom: string) => void;
  selectedType: ExperienceType | null;
  customValue: string;
}

export default function ExperienceSelector({
  onSelect,
  selectedType,
  customValue,
}: ExperienceSelectorProps) {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <h2 className="mb-2 text-center text-2xl font-bold text-slate-900">
        ¿Qué experiencia quieres transformar hoy?
      </h2>
      <p className="mb-8 text-center text-slate-500">
        Selecciona la categoría que mejor describa tu experiencia
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3">
        {EXPERIENCE_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id, "")}
            className={`group flex flex-col items-start rounded-xl border-2 p-4 text-left transition-all ${
              selectedType === option.id
                ? "border-primary-500 bg-primary-50 shadow-sm"
                : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
            }`}
          >
            <span className="mb-2 text-2xl">{option.icon}</span>
            <span
              className={`mb-1 text-sm font-semibold ${
                selectedType === option.id
                  ? "text-primary-700"
                  : "text-slate-800"
              }`}
            >
              {option.label}
            </span>
            <span className="text-xs leading-relaxed text-slate-400">
              {option.description}
            </span>
          </button>
        ))}
      </div>

      {selectedType === "other" && (
        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Cuéntanos brevemente de qué se trata
          </label>
          <input
            type="text"
            value={customValue}
            onChange={(e) => onSelect("other", e.target.value)}
            placeholder="Ej: Organizé un evento de networking en mi universidad"
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-primary-500 focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}
