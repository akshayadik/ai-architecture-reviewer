// src/types/critique.ts

export interface ArchitectureCritique {
  summary: string;
  bottlenecks: string[];
  scalability_risks: string[];
  reliability_gaps: string[];
  cost_red_flags: string[];
  suggested_improvements: string[];
  confidence_score: number;
  reasoning: string;
}