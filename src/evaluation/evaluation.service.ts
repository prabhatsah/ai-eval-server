import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EvaluationService {
  constructor(private readonly prisma: PrismaService) {}

  async evaluateMcqs(payload: {
    candidateAssessmentId: string;
    answers: {
      mcqQuestionId: string;
      selectedOptionIndex: number;
    }[];
  }) {
    //////////////////////////////////////////////////////
    // FETCH QUESTIONS
    //////////////////////////////////////////////////////

    const questionIds = payload.answers.map((answer) => answer.mcqQuestionId);

    const questions = await this.prisma.mcqQuestion.findMany({
      where: {
        id: {
          in: questionIds,
        },
      },
    });

    if (!questions.length) {
      throw new NotFoundException('Questions not found');
    }

    // MAP QUESTIONS
    const questionMap = new Map(
      questions.map((question) => [question.id, question]),
    );

    // EVALUATION
    let correct = 0;

    const skillMap: Record<
      string,
      {
        total: number;
        correct: number;
      }
    > = {};

    const responses = payload.answers.map((answer) => {
      const question = questionMap.get(answer.mcqQuestionId);

      if (!question) {
        throw new NotFoundException(
          `Question ${answer.mcqQuestionId} not found`,
        );
      }

      // CHECK ANSWER/////////////////////////////////
      const isCorrect =
        question.correctAnswerIndex === answer.selectedOptionIndex;

      if (isCorrect) {
        correct++;
      }

      // SKILL ANALYTICS
      const skills = (question.skills as string[]) || [];

      for (const skill of skills) {
        // INIT SKILL
        if (!skillMap[skill]) {
          skillMap[skill] = {
            total: 0,
            correct: 0,
          };
        }

        // TOTAL
        skillMap[skill].total += 1;

        //////////////////////////////////////////////////
        // CORRECT
        //////////////////////////////////////////////////

        if (isCorrect) {
          skillMap[skill].correct += 1;
        }
      }

      //////////////////////////////////////////////////
      // RESPONSE
      //////////////////////////////////////////////////

      return {
        mcqQuestionId: question.id,
        selectedOptionIndex: answer.selectedOptionIndex,
        isCorrect,
        score: isCorrect ? 1 : 0,
      };
    });

    //////////////////////////////////////////////////////
    // SCORE
    //////////////////////////////////////////////////////

    const totalQuestions = payload.answers.length;

    const percentage =
      totalQuestions > 0
        ? Number(((correct / totalQuestions) * 100).toFixed(2))
        : 0;

    //////////////////////////////////////////////////////
    // SKILL BREAKDOWN
    //////////////////////////////////////////////////////

    const skillBreakdown: Record<string, number> = {};

    for (const skill in skillMap) {
      const data = skillMap[skill];

      skillBreakdown[skill] = Number(
        ((data.correct / data.total) * 100).toFixed(2),
      );
    }

    //////////////////////////////////////////////////////
    // RETURN
    //////////////////////////////////////////////////////

    return {
      responses,
      totalQuestions,
      correct,
      wrong: totalQuestions - correct,
      percentage,
      skillBreakdown,
    };
  }
}
