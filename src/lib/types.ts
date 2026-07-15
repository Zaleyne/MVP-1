export type ExperienceType =
  | "internship"
  | "trabajo-profesional"
  | "freelance"
  | "emprendimiento"
  | "personal-project"
  | "university-project"
  | "hackathon"
  | "voluntariado"
  | "part-time"
  | "other";

export interface ExperienceOption {
  id: ExperienceType;
  label: string;
  icon: string;
  description: string;
}

export const EXPERIENCE_OPTIONS: ExperienceOption[] = [
  {
    id: "internship",
    label: "Pasantía / Internship",
    icon: "🏢",
    description: "Experiencia profesional dentro de una empresa mediante prácticas, programas de formación o posiciones temporales.",
  },
  {
    id: "trabajo-profesional",
    label: "Trabajo Profesional",
    icon: "💼",
    description: "Experiencia laboral formal relacionada con tu área de estudio o carrera profesional.",
  },
  {
    id: "freelance",
    label: "Trabajo Freelance",
    icon: "💻",
    description: "Proyectos realizados para clientes o empresas de manera independiente, ofreciendo servicios o soluciones.",
  },
  {
    id: "emprendimiento",
    label: "Emprendimiento / Proyecto Propio",
    icon: "🚀",
    description: "Creación y gestión de un negocio, producto, servicio o iniciativa propia.",
  },
  {
    id: "personal-project",
    label: "Proyecto Personal",
    icon: "💡",
    description: "Proyectos creados por iniciativa propia para aprender, resolver problemas o desarrollar habilidades.",
  },
  {
    id: "university-project",
    label: "Proyecto Universitario",
    icon: "🎓",
    description: "Trabajos académicos, proyectos finales, investigaciones o actividades realizadas durante la universidad.",
  },
  {
    id: "hackathon",
    label: "Hackathon / Competencia",
    icon: "⚡",
    description: "Participación en retos, concursos o eventos donde se crean soluciones en un tiempo determinado.",
  },
  {
    id: "voluntariado",
    label: "Voluntariado / Liderazgo",
    icon: "🤝",
    description: "Actividades donde colaboraste, organizaste o lideraste iniciativas dentro de comunidades u organizaciones.",
  },
  {
    id: "part-time",
    label: "Trabajo Part-time / Informal",
    icon: "🧑‍💼",
    description: "Trabajos temporales o de medio tiempo que permiten desarrollar habilidades como comunicación, responsabilidad y atención al cliente.",
  },
  {
    id: "other",
    label: "Otro",
    icon: "✨",
    description: "Cualquier otra experiencia que consideres relevante.",
  },
];

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface InterviewResponse {
  type: "question" | "complete";
  content: string;
  questionNumber?: number;
  totalQuestions?: number;
}

export interface GenerateResponse {
  cvBullets: string;
  starAnswer: string;
  explanation: string;
}

export type InterviewStep =
  | "confidence-before"
  | "experience-select"
  | "interview"
  | "confidence-after"
  | "results"
  | "feedback";

export interface FeedbackAnswers {
  perceptionChange: string | null;
  mostValuable: string | null;
  wouldUse: string | null;
}

export interface SessionRow {
  id?: string;
  created_at?: string;
  started_at?: string;
  confidence_before: number;
  confidence_after: number;
  experience_type: string;
  custom_experience: string | null;
  messages: ChatMessage[];
  question_count: number;
  cv_bullets: string;
  star_answer: string;
  explanation: string;
  completed?: boolean;
  abandoned_at_step?: string | null;
  feedback_perception: string | null;
  feedback_valuable: string | null;
  feedback_use_again: string | null;
}
