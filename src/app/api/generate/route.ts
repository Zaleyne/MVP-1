import { NextRequest, NextResponse } from "next/server";
import openrouter, { MODEL } from "@/lib/openrouter";
import { buildGenerationMessages } from "@/lib/prompts";
import { ExperienceType, GenerateResponse } from "@/lib/types";

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

    const apiMessages = buildGenerationMessages(experienceType, messages);

    const completion = await openrouter.chat.completions.create({
      model: MODEL,
      messages: apiMessages,
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No se pudieron generar los resultados" },
        { status: 500 }
      );
    }

    let parsed: GenerateResponse;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch {
      parsed = {
        cvBullets: content,
        starAnswer: "",
        explanation: "Revisa los resultados generados.",
      };
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("[GENERATE API ERROR]", error);
    return NextResponse.json(
      { error: "Error del servidor. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
