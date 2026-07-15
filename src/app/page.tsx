"use client";

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-8 inline-flex items-center rounded-full bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700">
          ✨ AI Career Coach
        </div>

        <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
          Convierte tus experiencias en{" "}
          <span className="text-primary-600">evidencia profesional</span>
        </h1>

        <p className="mb-10 text-lg leading-relaxed text-slate-600">
          Deja de pensar que "no tienes experiencia". Aprende a presentar lo que
          ya has logrado de una manera que los reclutadores entienden y valoran.
        </p>

        <button
          onClick={() => router.push("/interview")}
          className="inline-flex items-center rounded-xl bg-primary-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-600/30 active:scale-[0.98]"
        >
          Comenzar
          <svg
            className="ml-2 h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </button>

        <p className="mt-8 text-sm text-slate-400">
          Gratuito · Sin registro · Tus datos quedan en tu navegador
        </p>
      </div>
    </div>
  );
}
