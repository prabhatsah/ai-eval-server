export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface InterviewHistoryItem {
  question: string;
  answer: string;
  score?: number;
}

export interface InterviewInput {
  topic: string;
  history: InterviewHistoryItem[];
  latestAnswer: string;
}

export interface InterviewEvaluation {
  score: number;
  confidence: number;
  strengths: string[];
  weaknesses: string[];
}

export interface NextQuestion {
  question: string;
  difficulty: DifficultyLevel;
  focusArea: string;
}

export interface InterviewResult {
  evaluation: InterviewEvaluation;
  nextQuestion: NextQuestion;
}
