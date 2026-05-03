export type SectionType = 'AI' | 'MCQ' | 'CODING';

export interface SectionConfig {
  weight: number; // 0–1
}

export interface EvaluationConfig {
  sections: Record<SectionType, SectionConfig>;
  passingScore: number; // 0–100
}
