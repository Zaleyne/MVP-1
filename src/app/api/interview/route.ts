import { NextRequest, NextResponse } from "next/server";
import openrouter, { MODEL } from "@/lib/openrouter";
import { buildInterviewMessages } from "@/lib/prompts";
import { ExperienceType, InterviewResponse } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { experienceType, messages } = body as {
      experienceType: ExperienceType;
      messages: { role: "user" | "assistant"; content: string }[];
    };

    if (!experienceType || !messages) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    const apiMessages = buildInterviewMessages(experienceType, messages);

    const completion = await openrouter.chat.completions.create({
      model: MODEL,
      messages: apiMessages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No se pudo generar una respuesta" },
        { status: 500 }
      );
    }

    let parsed: InterviewResponse;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        parsed = { type: "question", content: content };
      }
    } catch {
      parsed = { type: "question", content: content };
    }

    return NextResponse.json(parsed);
  } catch (error: unknown) {
    console.error("[INTERVIEW API ERROR]", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "Error del servidor. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
