"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/lib/types";
import ProgressBar from "./ProgressBar";

interface InterviewChatProps {
  messages: ChatMessage[];
  questionCount: number;
  totalQuestions: number;
  isLoading: boolean;
  onSubmitAnswer: (answer: string) => void;
}

export default function InterviewChat({
  messages,
  questionCount,
  totalQuestions,
  isLoading,
  onSubmitAnswer,
}: InterviewChatProps) {
  const [answer, setAnswer] = useState("");
  const [inputBottom, setInputBottom] = useState("0px");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, [messages, isLoading]);

  useEffect(() => {
    const updateInputPosition = () => {
      const vv = window.visualViewport;
      if (!vv) return;
      const bottom = window.innerHeight - (vv.offsetTop + vv.height);
      setInputBottom(`${Math.max(0, bottom)}px`);
    };

    window.visualViewport?.addEventListener("resize", updateInputPosition);
    window.visualViewport?.addEventListener("scroll", updateInputPosition);
    window.addEventListener("resize", updateInputPosition);
    updateInputPosition();

    return () => {
      window.visualViewport?.removeEventListener("resize", updateInputPosition);
      window.visualViewport?.removeEventListener("scroll", updateInputPosition);
      window.removeEventListener("resize", updateInputPosition);
    };
  }, []);

  const handleFocus = () => {
    setTimeout(() => {
      textareaRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 300);
  };

  const handleSubmit = () => {
    const trimmed = answer.trim();
    if (!trimmed || isLoading) return;
    onSubmitAnswer(trimmed);
    setAnswer("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="pb-4">
        <ProgressBar current={questionCount} total={totalQuestions} />
      </div>

      <div className="space-y-4 pb-40">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary-600 text-white"
                  : "bg-white text-slate-700 shadow-sm border border-slate-100"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-white px-4 py-3 text-sm shadow-sm border border-slate-100">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300 [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300 [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {!isLoading && (
        <div
          className="fixed left-0 right-0 z-50 border-t border-slate-100 bg-white px-4 py-3"
          style={{ bottom: inputBottom }}
        >
          <div className="mx-auto flex max-w-2xl gap-3">
            <textarea
              ref={textareaRef}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              placeholder="Escribe tu respuesta..."
              rows={2}
              className="flex-1 resize-none rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-primary-500 focus:outline-none"
            />
            <button
              onClick={handleSubmit}
              disabled={!answer.trim()}
              className="self-end rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-primary-600/20 transition-all hover:bg-primary-700 disabled:opacity-40 disabled:shadow-none"
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
