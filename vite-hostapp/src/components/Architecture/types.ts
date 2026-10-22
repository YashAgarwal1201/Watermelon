// File: src/components/Architecture/types.ts

export interface ParadigmItem {
  title: string;
  tag: string;
  remotesCount: string;
  borderClass: string;
  badgeClass: string;
  description: string;
  strengths: string[];
  usedFor: string;
}

export interface MatrixRow {
  criteria: string;
  mf: string;
  wc: string;
  iframe: string;
}

export type FindingCategory =
  | "All"
  | "Runtime & Globals"
  | "CSS & Shadow DOM"
  | "Security & CSP";

export interface EngineeringFinding {
  id: string;
  title: string;
  category: FindingCategory;
  categoryBadgeClass: string;
  severity: "Critical Architectural Pivot" | "CSS Isolation" | "Cross-Origin Blocker" | "Performance" | "Developer Experience";
  severityBadgeClass: string;
  iconClass: string;
  synopsis: string;
  symptoms: {
    description: string;
    details: string[];
    errorSignature?: string;
  };
  failedAttempts: {
    description: string;
    attempts: string[];
  };
  solution: {
    title: string;
    description: string;
    details: string[];
  };
  takeaway: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface QuickNavItem {
  id: string;
  shortLabel: string;
  fullLabel: string;
}
