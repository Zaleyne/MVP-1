"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ExperienceType,
  ChatMessage,
  GenerateResponse,
  InterviewStep,
  FeedbackAnswers,
} from "@/lib/types";
import { logMetric, trackEvent } from "@/lib/analytics";
import ExperienceSelector from "@/components/ExperienceSelector";
import InterviewChat from "@/components/InterviewChat";
import ConfidenceRating from "@/components/ConfidenceRating";
import ResultsTabs from "@/components/ResultsTabs";
import FeedbackForm from "@/components/FeedbackForm";

const TOTAL_QUESTIONS = 5;

export default function InterviewPage() {
  const router = useRouter();
  const [step, setStep] = useState<InterviewStep>("confidence-before");
  const [experienceType, setExperienceType] =
    useState<ExperienceType | null>(null);
  const [customExperience, setCustomExperience] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [confidenceBefore, setConfidenceBefore] = useState<number | null>(null);
  const [confidenceAfter, setConfidenceAfter] = useState<number | null>(null);
  const [results, setResults] = useState<GenerateResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const [savedSessionId, setSavedSessionId] = useState<string | null>(null);
  const [interviewHeight, setInterviewHeight] = useState<string>("100dvh");
  const sessionStartedAt = useRef(new Date().toISOString());
  const stepRef = useRef<InterviewStep>(step);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  useEffect(() => {
    if (step !== "interview") return;

    const updateHeight = () => {
      const vvh = window.visualViewport?.height;
      const wh = window.innerHeight;
      const height = vvh != null ? Math.min(vvh, wh) : wh;
      setInterviewHeight(`${height}px`);
    };

    window.visualViewport?.addEventListener("resize", updateHeight);
    window.visualViewport?.addEventListener("scroll", updateHeight);
    window.addEventListener("resize", updateHeight);
    updateHeight();

    return () => {
      window.visualViewport?.removeEventListener("resize", updateHeight);
      window.visualViewport?.removeEventListener("scroll", updateHeight);
      window.removeEventListener("resize", updateHeight);
    };
  }, [step]);

  const buildSessionPayload = useCallback(
    (overrides?: {
      confidence_after?: number | null;
      feedback_perception?: string | null;
      feedback_valuable?: string | null;
      feedback_use_again?: string | null;
      completed?: boolean;
      abandoned_at_step?: string | null;
    }) => {
      return {
        started_at: sessionStartedAt.current,
        confidence_before: confidenceBefore ?? 0,
        confidence_after: overrides?.confidence_after ?? confidenceAfter ?? 0,
        experience_type: experienceType ?? "other",
        custom_experience: customExperience || null,
        messages,
        question_count: questionCount,
        cv_bullets: results?.cvBullets || "",
        star_answer: results?.starAnswer || "",
        explanation: results?.explanation || "",
        completed: overrides?.completed ?? true,
        abandoned_at_step: overrides?.abandoned_at_step ?? null,
        feedback_perception: overrides?.feedback_perception ?? null,
        feedback_valuable: overrides?.feedback_valuable ?? null,
        feedback_use_again: overrides?.feedback_use_again ?? null,
      };
    },
    [confidenceBefore, confidenceAfter, experienceType, customExperience, messages, questionCount, results]
  );

  const saveSession = useCallback(
    async (overrides?: Parameters<typeof buildSessionPayload>[0]) => {
      const payload = buildSessionPayload(overrides);
      try {
        const response = await fetch("/api/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (data.id) {
          setSavedSessionId(data.id);
          logMetric("SESSION_SAVED", { sessionId: data.id, completed: payload.completed });
          return data.id as string;
        }
      } catch (error) {
        console.error("[SESSION SAVE ERROR]", error);
      }
      return null;
    },
    [buildSessionPayload]
  );

  const updateSession = useCallback(
    async (updates: Record<string, unknown>) => {
      if (!savedSessionId) return;
      try {
        await fetch("/api/session", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: savedSessionId, ...updates }),
        });
        logMetric("SESSION_UPDATED", { sessionId: savedSessionId, keys: Object.keys(updates) });
      } catch (error) {
        console.error("[SESSION UPDATE ERROR]", error);
      }
    },
    [savedSessionId]
  );

  useEffect(() => {
    const handleBeforeUnload = () => {
      const currentStep = stepRef.current;
      if (currentStep === "results" || currentStep === "feedback") return;

      const payload = {
        ...buildSessionPayload({
          completed: false,
          abandoned_at_step: currentStep,
        }),
      };

      navigator.sendBeacon(
        "/api/session",
        new Blob([JSON.stringify(payload)], { type: "application/json" })
      );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [buildSessionPayload]);

  const fetchNextQuestion = useCallback(
    async (history: ChatMessage[]) => {
      setIsLoading(true);
      logMetric("FETCH_QUESTION", { questionIndex: history.filter((m) => m.role === "assistant").length + 1 });
      try {
        const response = await fetch("/api/interview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ experienceType, messages: history }),
        });

        if (!response.ok) {
          const errorBody = await response.text().catch(() => "unknown");
          throw new Error(`Error del servidor: ${response.status} - ${errorBody}`);
        }

        const data = await response.json();

        if (data.type === "complete") {
          const assistantMsg: ChatMessage = {
            role: "assistant",
            content: data.content,
          };
          setMessages((prev) => [...prev, assistantMsg]);
          setStep("confidence-after");
          logMetric("INTERVIEW_COMPLETE", { totalMessages: history.length + 1 });
        } else {
          const assistantMsg: ChatMessage = {
            role: "assistant",
            content: data.content,
          };
          setMessages((prev) => [...prev, assistantMsg]);
          setQuestionCount(data.questionNumber || history.filter((m) => m.role === "assistant").length + 1);
        }
      } catch (error) {
        console.error("[INTERVIEW ERROR]", error);
        const errorMsg: ChatMessage = {
          role: "assistant",
          content:
            "Hubo un error de conexión. Por favor, intenta de nuevo.",
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [experienceType]
  );

  const handleExperienceSelect = (type: ExperienceType, custom: string) => {
    setExperienceType(type);
    setCustomExperience(custom);
    logMetric("EXPERIENCE_SELECTED", { type, custom });
    trackEvent("started_analysis", { experience_type: type });
  };

  const handleStartInterview = () => {
    if (!experienceType) return;
    logMetric("INTERVIEW_STARTED", { experienceType });
    trackEvent("started_experience_input", { experience_type: experienceType });
    setStep("interview");
    fetchNextQuestion([]);
  };

  const handleSubmitAnswer = (answer: string) => {
    const userMsg: ChatMessage = { role: "user", content: answer };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    logMetric("ANSWER_SUBMITTED", { answerLength: answer.length, questionCount });
    trackEvent("submitted_experience", { answer_length: answer.length, question_count: questionCount });
    fetchNextQuestion(newHistory);
  };

  const generateResults = useCallback(async () => {
    setIsGenerating(true);
    logMetric("GENERATE_RESULTS_START", { messagesCount: messages.length });
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experienceType, messages }),
      });

      if (!response.ok) throw new Error("Error del servidor");

      const data = await response.json();
      setResults(data);
      setStep("results");
      logMetric("GENERATE_RESULTS_SUCCESS", {
        cvBulletsLength: data.cvBullets?.length || 0,
        starAnswerLength: data.starAnswer?.length || 0,
      });
      trackEvent("received_result", {
        cv_bullets_length: data.cvBullets?.length || 0,
        star_answer_length: data.starAnswer?.length || 0,
      });

      saveSession({ completed: true, confidence_after: confidenceAfter });
    } catch (error) {
      console.error("[GENERATE ERROR]", error);
      setResults({
        cvBullets:
          "Hubo un error al generar los resultados. Por favor, intenta de nuevo.",
        starAnswer: "",
        explanation: "Error de conexión.",
      });
      setStep("results");
      saveSession({ completed: false, abandoned_at_step: "results-error" });
    } finally {
      setIsGenerating(false);
    }
  }, [experienceType, messages, confidenceAfter, saveSession]);

  const handleConfidenceAfterSubmit = () => {
    logMetric("CONFIDENCE_AFTER", { value: confidenceAfter });
    generateResults();
  };

  const handleFeedbackSubmit = (answers: FeedbackAnswers) => {
    setFeedbackSubmitted(true);
    logMetric("FEEDBACK_SUBMITTED", {
      perceptionChange: answers.perceptionChange,
      mostValuable: answers.mostValuable,
      wouldUse: answers.wouldUse,
    });
    trackEvent("submitted_feedback", {
      perception_change: answers.perceptionChange,
      most_valuable: answers.mostValuable,
      would_use: answers.wouldUse,
    });

    updateSession({
      completed: true,
      confidence_after: confidenceAfter,
      feedback_perception: answers.perceptionChange,
      feedback_valuable: answers.mostValuable,
      feedback_use_again: answers.wouldUse,
    });
  };

  return (
    <div className="min-h-screen px-4 py-8 pb-[calc(2rem+env(safe-area-inset-bottom,0px))]">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 grid grid-cols-[auto_1fr_auto] items-center gap-4">
          <button
            onClick={() => router.push("/")}
            className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
          >
            ← Volver
          </button>
          {step === "interview" ? (
            <div className="mx-auto max-w-xl rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs leading-relaxed text-amber-700">
              💡 Cuéntame tu experiencia en tus propias palabras. Aunque parezca algo pequeño, entre más detalles compartas sobre lo que hiciste, mejores serán los resultados. La IA te ayudará a transformar tu experiencia en una historia profesional para tu CV y entrevistas.
            </div>
          ) : (
            <span className="text-xs text-slate-400">
              AI Career Coach
            </span>
          )}
          {step === "interview" && <div />}
        </div>

        {/* Step: Confidence Before */}
        {step === "confidence-before" && (
          <div className="flex min-h-[60vh] items-center justify-center">
            <ConfidenceRating
              title="¿Qué tan confiado te sientes?"
              subtitle="Antes de empezar, evalúa qué tan confiado te sientes para presentar esta experiencia de manera profesional"
              value={confidenceBefore}
              onChange={setConfidenceBefore}
              onContinue={() => {
                logMetric("CONFIDENCE_BEFORE", { value: confidenceBefore });
                setStep("experience-select");
              }}
            />
          </div>
        )}

        {/* Step: Experience Selection */}
        {step === "experience-select" && (
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="w-full">
              <ExperienceSelector
                onSelect={handleExperienceSelect}
                selectedType={experienceType}
                customValue={customExperience}
              />
              {experienceType && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={handleStartInterview}
                    className="rounded-xl bg-primary-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-700"
                  >
                    Empezar entrevista
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step: Interview */}
        {step === "interview" && (
          <div
            className="overflow-hidden pt-4 md:h-auto md:overflow-visible md:py-4"
            style={{ height: interviewHeight }}
          >
            <InterviewChat
              messages={messages}
              questionCount={questionCount}
              totalQuestions={TOTAL_QUESTIONS}
              isLoading={isLoading}
              onSubmitAnswer={handleSubmitAnswer}
            />
          </div>
        )}

        {/* Step: Confidence After */}
        {step === "confidence-after" && (
          <div className="flex min-h-[60vh] items-center justify-center">
            <ConfidenceRating
              title="¿Y ahora?"
              subtitle="Después de reflexionar sobre tu experiencia, ¿qué tan confiado te sientes ahora?"
              value={confidenceAfter}
              onChange={setConfidenceAfter}
              onContinue={handleConfidenceAfterSubmit}
            />
          </div>
        )}

        {/* Step: Results */}
        {step === "results" && results && (
          <div className="py-4">
            <ResultsTabs
              results={results}
              onRegenerate={generateResults}
              isRegenerating={isGenerating}
              onCopy={() => trackEvent("copied_result", { experience_type: experienceType })}
            />

            {!feedbackSubmitted && experienceType && (
              <FeedbackForm
                experienceType={experienceType}
                results={results}
                onSubmit={handleFeedbackSubmit}
              />
            )}

            {feedbackSubmitted && (
              <div className="mx-auto mt-8 w-full max-w-3xl">
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                  <div className="mb-3 text-4xl">🎉</div>
                  <h3 className="mb-2 text-lg font-bold text-slate-900">
                    ¡Gracias por tu opinión!
                  </h3>
                  <p className="text-sm text-slate-500">
                    Tu feedback nos ayuda a crear una mejor herramienta para que más estudiantes descubran el valor de sus experiencias.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading overlay for generation */}
        {isGenerating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm">
            <div className="rounded-2xl bg-white p-8 text-center shadow-xl">
              <div className="mb-4 flex justify-center gap-1">
                <span className="h-3 w-3 animate-bounce rounded-full bg-primary-500 [animation-delay:-0.3s]" />
                <span className="h-3 w-3 animate-bounce rounded-full bg-primary-500 [animation-delay:-0.15s]" />
                <span className="h-3 w-3 animate-bounce rounded-full bg-primary-500" />
              </div>
              <p className="text-sm font-medium text-slate-700">
                Generando tu evidencia profesional...
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Esto puede tomar unos segundos
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
