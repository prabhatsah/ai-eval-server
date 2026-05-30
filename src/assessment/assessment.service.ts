import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AssessmentAgent } from './agents/assessment.agent';
import { AssessmentStatus, Difficulty, Prisma } from '@prisma/client';
import { AssessmentCriticService } from 'src/assessment-critic/assessment-critic.service';
import { JwtUser } from 'src/auth/interfaces/jwt-payload.interface';
import { customAlphabet } from 'nanoid';

interface DurationInput {
  mcqCount: number;
  codingCount: number;
  difficulty: Difficulty;
}

@Injectable()
export class AssessmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly assessmentAgent: AssessmentAgent,
    private readonly assessmentCriticService: AssessmentCriticService,
  ) {}

  async generateAssessment(
    dto: {
      jdId: string;
      mcqCount: number;
      codingCount: number;
    },
    user: JwtUser,
    llmProvider: string,
    apiKey: string,
  ) {
    if (!user.userId) {
      throw new BadRequestException('User not authenticated');
    }

    if (!llmProvider) {
      throw new BadRequestException('LLM provider is missing');
    }

    if (!apiKey) {
      throw new BadRequestException('API key is missing');
    }
    const jd = await this.prisma.jobDescription.findUnique({
      where: {
        id: dto.jdId,
        createdById: user.userId,
      },
    });

    if (!jd) {
      throw new NotFoundException('JD not found');
    }

    const existingAssessment = await this.prisma.assessment.findFirst({
      where: {
        jobDescriptionId: dto.jdId,
        createdById: user.userId,
      },
    });

    if (existingAssessment) {
      throw new NotFoundException('Assessment already exist with this jd');
    }

    // GENERATE ASSESSMENT
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
      llmProvider,
      apiKey,
    );

    const durationMinutes = this.calculateAssessmentDuration({
      mcqCount: dto.mcqCount,
      codingCount: dto.codingCount,
      difficulty: jd.difficulty,
    });

    const uniqueAssessmentCode = this.generateAssessmentCode();

    // SAVE INITIAL ASSESSMENT
    const assessment = await this.prisma.assessment.create({
      data: {
        jobDescriptionId: jd.id,
        assessmentCode: uniqueAssessmentCode,
        createdById: user.userId,
        role: jd.role,
        difficulty: jd.difficulty,
        experienceYears: jd.experienceYears,
        mcqCount: dto.mcqCount,
        codingCount: dto.codingCount,
        primarySkills: jd.primarySkills as Prisma.InputJsonValue,
        secondarySkills: (jd.secondarySkills ??
          Prisma.JsonNull) as Prisma.InputJsonValue,
        focusAreas: (jd.focusAreas ?? Prisma.JsonNull) as Prisma.InputJsonValue,
        durationMinutes,
        status: 'PENDING_REVIEW',
        mcqs: {
          create: generated.mcqs.map((mcq) => ({
            question: mcq.question,
            skills: mcq.skills,
            options: mcq.options,
            correctAnswerIndex: mcq.correctAnswerIndex,
            explanation: mcq.explanation,
            difficulty: mcq.difficulty,
          })),
        },

        codingQuestions: {
          create: generated.codingQuestions.map((question) => ({
            title: question.title,
            problem: question.problem,
            constraints: question.constraints,
            sampleCases: question.sampleCases,
            hiddenTestCases: question.hiddenTestCases,
            expectedApproach: question.expectedApproach,
            timeComplexity: question.timeComplexity,
            spaceComplexity: question.spaceComplexity,
            difficulty: question.difficulty,
          })),
        },
      },

      include: {
        mcqs: true,
        codingQuestions: true,
      },
    });

    // REVIEW ASSESSMENT
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
      llmProvider,
      apiKey,
    );

    // UPDATE REVIEW STATUS
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

  async getAssessment(id: string, user: JwtUser) {
    const assessment = await this.prisma.assessment.findUnique({
      where: {
        id,
        createdById: user.userId,
        status: AssessmentStatus.APPROVED,
      },
      include: {
        mcqs: true,
        codingQuestions: true,
      },
    });

    if (!assessment) {
      throw new NotFoundException('No approved assessment found');
    }

    return assessment;
  }

  async getAssessments(user: JwtUser) {
    const assessments = this.prisma.assessment.findMany({
      where: { createdById: user.userId, status: AssessmentStatus.APPROVED },
      orderBy: {
        createdAt: 'desc',
      },

      include: {
        mcqs: true,
        codingQuestions: true,
      },
    });

    if (!assessments) {
      throw new NotFoundException('No approved assessments found');
    }

    return assessments;
  }

  async deleteAssessment(id: string, user: JwtUser) {
    const assessment = await this.prisma.assessment.findUnique({
      where: { id, createdById: user.userId },
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

  calculateAssessmentDuration = ({
    mcqCount,
    codingCount,
    difficulty,
  }: DurationInput): number => {
    // 2 mins per MCQ
    const mcqDuration = mcqCount * 2;

    // coding duration based on difficulty
    let codingDurationPerQuestion = 0;

    switch (difficulty) {
      case 'EASY':
        codingDurationPerQuestion = 20;
        break;

      case 'MEDIUM':
        codingDurationPerQuestion = 40;
        break;

      case 'HARD':
        codingDurationPerQuestion = 60;
        break;

      default:
        codingDurationPerQuestion = 30;
    }

    const codingDuration = codingCount * codingDurationPerQuestion;

    // additional buffer
    const buffer = 10;

    return mcqDuration + codingDuration + buffer;
  };

  generateAssessmentCode() {
    const nanoid = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 6);

    return `EVAL-${nanoid()}`;
  }
}
