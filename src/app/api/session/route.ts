import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { SessionRow } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase no está configurado. Verifica las variables de entorno." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const {
      confidence_before,
      confidence_after,
      experience_type,
      custom_experience,
      messages,
      question_count,
      cv_bullets,
      star_answer,
      explanation,
      completed,
      abandoned_at_step,
      started_at,
      feedback_perception,
      feedback_valuable,
      feedback_use_again,
    } = body as Omit<SessionRow, "id" | "created_at">;

    if (confidence_before == null || !experience_type) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("sessions")
      .insert({
        started_at: started_at || null,
        confidence_before,
        confidence_after: confidence_after ?? 0,
        experience_type,
        custom_experience: custom_experience || null,
        messages,
        question_count: question_count ?? 0,
        cv_bullets: cv_bullets || "",
        star_answer: star_answer || "",
        explanation: explanation || "",
        completed: completed ?? false,
        abandoned_at_step: abandoned_at_step || null,
        feedback_perception: feedback_perception || null,
        feedback_valuable: feedback_valuable || null,
        feedback_use_again: feedback_use_again || null,
      })
      .select()
      .single();

    if (error) {
      console.error("[SESSION API] Supabase insert error:", error.message);
      return NextResponse.json(
        { error: `Error al guardar sesión: ${error.message}` },
        { status: 500 }
      );
    }

    console.log("[SESSION API] Sesión guardada:", data.id);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[SESSION API ERROR]", message);
    return NextResponse.json(
      { error: `Error del servidor: ${message}` },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase no está configurado." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { id, ...updates } = body as { id: string } & Partial<SessionRow>;

    if (!id) {
      return NextResponse.json(
        { error: "Falta el id de la sesión" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("sessions")
      .update({
        confidence_after: updates.confidence_after ?? undefined,
        feedback_perception: updates.feedback_perception ?? undefined,
        feedback_valuable: updates.feedback_valuable ?? undefined,
        feedback_use_again: updates.feedback_use_again ?? undefined,
        completed: updates.completed ?? undefined,
        abandoned_at_step: updates.abandoned_at_step ?? undefined,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[SESSION API] Supabase update error:", error.message);
      return NextResponse.json(
        { error: `Error al actualizar sesión: ${error.message}` },
        { status: 500 }
      );
    }

    console.log("[SESSION API] Sesión actualizada:", data.id);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[SESSION API PUT ERROR]", message);
    return NextResponse.json(
      { error: `Error del servidor: ${message}` },
      { status: 500 }
    );
  }
}
