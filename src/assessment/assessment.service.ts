import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AssessmentAgent } from './agents/assessment.agent';
import { Prisma } from '@prisma/client';
import { AssessmentCriticService } from 'src/assessment-critic/assessment-critic.service';

@Injectable()
export class AssessmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly assessmentAgent: AssessmentAgent,
    private readonly assessmentCriticService: AssessmentCriticService,
  ) {}

  // private readonly assessments: AssessmentEntity[] = [];

  async generateAssessment(
    dto: {
      jdId: string;
      mcqCount: number;
      codingCount: number;
    },
    apiKey: string,
  ) {
    const jd = await this.prisma.jobDescription.findUnique({
      where: {
        id: dto.jdId,
      },
    });

    if (!jd) {
      throw new NotFoundException('Job description not found');
    }

    // =========================
    // GENERATE ASSESSMENT
    // =========================
    const generated = await this.assessmentAgent.generateAssessment(
      {
        role: jd.role,
        primarySkills: jd.primarySkills as string[],
        secondarySkills: (jd.secondarySkills as string[]) || [],
        experienceYears: jd.experienceYears || 0,
        difficulty: jd.difficulty,
        focusAreas: (jd.focusAreas as string[]) || [],
        mcqCount: dto.mcqCount,
        codingCount: dto.codingCount,
      },
      apiKey,
    );

    // =========================
    // SAVE INITIAL ASSESSMENT
    // =========================
    const assessment = await this.prisma.assessment.create({
      data: {
        jobDescriptionId: jd.id,
        role: jd.role,
        difficulty: jd.difficulty,
        experienceYears: jd.experienceYears,
        mcqCount: dto.mcqCount,
        codingCount: dto.codingCount,
        primarySkills: jd.primarySkills as Prisma.InputJsonValue,
        secondarySkills: (jd.secondarySkills ??
          Prisma.JsonNull) as Prisma.InputJsonValue,
        focusAreas: (jd.focusAreas ?? Prisma.JsonNull) as Prisma.InputJsonValue,

        status: 'PENDING_REVIEW',

        mcqs: {
          create: generated.mcqs.map((mcq) => ({
            question: mcq.question,
            skill: mcq.skill,
            options: mcq.options,
            correctAnswer: mcq.correctAnswer,
            explanation: mcq.explanation,
            difficulty: mcq.difficulty,
          })),
        },

        codingQuestions: {
          create: generated.codingQuestions.map((question) => ({
            title: question.title,
            problem: question.problem,
            constraints: question.constraints,
            sampleInput: question.sampleInput,
            sampleOutput: question.sampleOutput,
            expectedApproach: question.expectedApproach,
            difficulty: question.difficulty || {},
          })),
        },
      },

      include: {
        mcqs: true,
        codingQuestions: true,
      },
    });

    // =========================
    // REVIEW ASSESSMENT
    // =========================

    const review = await this.assessmentCriticService.criticAssessment(
      {
        role: jd.role,
        difficulty: jd.difficulty,
        experienceYears: jd.experienceYears || 0,
        primarySkills: jd.primarySkills as string[],
        secondarySkills: (jd.secondarySkills as string[]) || [],
        focusAreas: (jd.focusAreas as string[]) || [],
        mcqs: assessment.mcqs,
        codingQuestions: assessment.codingQuestions,
      },
      apiKey,
    );

    // =========================
    // UPDATE REVIEW STATUS
    // =========================

    let status: 'APPROVED' | 'NEEDS_REVISION' | 'REJECTED' = 'APPROVED';

    if (review.recommendation === 'revise') {
      status = 'NEEDS_REVISION';
    }

    if (review.recommendation === 'rejected') {
      status = 'REJECTED';
    }

    const updatedAssessment = await this.prisma.assessment.update({
      where: {
        id: assessment.id,
      },

      data: {
        status,
        reviewScore: review.overallQualityScore,
        reviewRecommendation: review.recommendation,
        reviewIssues: review.issues as Prisma.InputJsonValue,
        reviewedAt: new Date(),
      },

      include: {
        mcqs: true,

        codingQuestions: true,
      },
    });

    return {
      assessment: updatedAssessment,
      review,
    };
  }

  async getAssessment(id: string) {
    const assessment = await this.prisma.assessment.findUnique({
      where: { id },
      include: {
        mcqs: true,
        codingQuestions: true,
      },
    });

    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    return assessment;
  }

  async getAssessments() {
    return this.prisma.assessment.findMany({
      orderBy: {
        createdAt: 'desc',
      },

      include: {
        mcqs: true,
        codingQuestions: true,
      },
    });
  }

  async deleteAssessment(id: string) {
    const assessment = await this.prisma.assessment.findUnique({
      where: { id },
    });

    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    await this.prisma.assessment.delete({
      where: { id },
    });

    return {
      message: 'Assessment deleted successfully',
    };
  }
}
