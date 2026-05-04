export type AnswerType = 'AI' | 'MCQ' | 'CODING';

export interface SubmitAnswerInput {
  attemptId: string;
  question: string;
  answer: string;
  type: AnswerType;
}
