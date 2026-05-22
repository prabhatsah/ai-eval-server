import { Injectable } from '@nestjs/common';

import { AssessmentCriticAgent } from './agents/assessment-critic.agent';

@Injectable()
export class AssessmentCriticService {
  constructor(private readonly assessmentCriticAgent: AssessmentCriticAgent) {}

  async criticAssessment(
    payload: {
      role: string;
      difficulty: string;
      experienceYears?: number;
      primarySkills: string[];
      secondarySkills?: string[];
      focusAreas?: string[];
      mcqs: any[];
      codingQuestions: any[];
    },

    apiKey: string,
  ) {
    return this.assessmentCriticAgent.criticAssessment(payload, apiKey);
  }
}
