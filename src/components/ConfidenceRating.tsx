"use client";

interface ConfidenceRatingProps {
  title: string;
  subtitle: string;
  value: number | null;
  onChange: (value: number) => void;
  onContinue: () => void;
}

const LABELS = [
  "",
  "Nada confiado",
  "Poco confiado",
  "Neutro",
  "Muy confiado",
  "Muyyy confiado",
];

export default function ConfidenceRating({
  title,
  subtitle,
  value,
  onChange,
  onContinue,
}: ConfidenceRatingProps) {
  return (
    <div className="mx-auto w-full max-w-lg text-center">
      <h2 className="mb-2 text-2xl font-bold text-slate-900">{title}</h2>
      <p className="mb-8 text-slate-500">{subtitle}</p>

      <div className="mb-6 flex justify-center gap-3">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`flex h-14 w-14 items-center justify-center rounded-xl text-lg font-bold transition-all ${
              value === n
                ? "bg-primary-600 text-white shadow-lg shadow-primary-600/25 scale-110"
                : "bg-white text-slate-600 border-2 border-slate-200 hover:border-slate-300"
            }`}
          >
            {n}
          </button>
        ))}
      </div>

      {value !== null && (
        <p className="mb-6 text-sm font-medium text-primary-600">
          {LABELS[value]}
        </p>
      )}

      <button
        onClick={onContinue}
        disabled={value === null}
        className="rounded-xl bg-primary-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
      >
        Continuar
      </button>
    </div>
  );
}
