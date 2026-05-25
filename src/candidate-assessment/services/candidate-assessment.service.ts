import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AssignAssessmentDto } from '../dto/assign-assessment.dto';
import { CandidateAssessmentSchema } from '../validators/candidate-assessment.schema';
import { AssessmentStatus, CandidateAssessmentStatus } from '@prisma/client';
import { EvaluationService } from 'src/evaluation/evaluation.service';
import { SubmitAssessmentDto } from '../dto/submit-assessment.dto';

@Injectable()
export class CandidateAssessmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly evaluationService: EvaluationService,
  ) {}

  //////////////////////////////////////////////////////
  // ASSIGN ASSESSMENT
  //////////////////////////////////////////////////////

  async assignAssessment(dto: AssignAssessmentDto) {
    // CHECK CANDIDATE
    const candidate = await this.prisma.user.findUnique({
      where: {
        id: dto.candidateId,
      },
    });

    if (!candidate) {
      throw new NotFoundException('Candidate not found');
    }

    // CHECK ASSESSMENT
    const assessment = await this.prisma.assessment.findUnique({
      where: {
        id: dto.assessmentId,
        status: AssessmentStatus.APPROVED,
      },
    });

    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    // CHECK DUPLICATE ASSIGNMENT
    const existing = await this.prisma.candidateAssessment.findUnique({
      where: {
        candidateId_assessmentId: {
          candidateId: dto.candidateId,
          assessmentId: dto.assessmentId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Assessment already assigned');
    }

    // CREATE ASSIGNMENT
    const assignment = await this.prisma.candidateAssessment.create({
      data: {
        candidateId: dto.candidateId,
        assessmentId: dto.assessmentId,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      },

      include: {
        assessment: true,
        candidate: true,
      },
    });

    return CandidateAssessmentSchema.parse(assignment);
  }

  //////////////////////////////////////////////////////
  // START ASSESSMENT
  //////////////////////////////////////////////////////

  async startAssessment(candidateAssessmentId: string) {
    const assignment = await this.prisma.candidateAssessment.findUnique({
      where: {
        id: candidateAssessmentId,
      },
    });

    if (!assignment) {
      throw new NotFoundException('Candidate assessment not found');
    }

    // STATUS VALIDATION
    if (assignment.status !== CandidateAssessmentStatus.ASSIGNED) {
      throw new BadRequestException('Assessment cannot be started');
    }

    // EXPIRATION CHECK
    if (assignment.expiresAt && assignment.expiresAt < new Date()) {
      await this.prisma.candidateAssessment.update({
        where: {
          id: assignment.id,
        },

        data: {
          status: CandidateAssessmentStatus.EXPIRED,
        },
      });

      throw new BadRequestException('Assessment expired');
    }

    // START
    const updated = await this.prisma.candidateAssessment.update({
      where: {
        id: assignment.id,
      },

      data: {
        status: CandidateAssessmentStatus.IN_PROGRESS,
        startedAt: new Date(),
      },
    });

    return CandidateAssessmentSchema.parse(updated);
  }

  // SUBMIT ASSESSMENT
  async submitAssessment(dto: SubmitAssessmentDto) {
    const assignment = await this.prisma.candidateAssessment.findUnique({
      where: {
        id: dto.candidateAssessmentId,
      },
      include: {
        assessment: {
          select: {
            durationMinutes: true,
          },
        },
      },
    });

    if (!assignment) {
      throw new NotFoundException('Candidate assessment not found');
    }

    // STATUS VALIDATION
    if (assignment.status !== CandidateAssessmentStatus.IN_PROGRESS) {
      throw new BadRequestException('Assessment is not in progress');
    }

    // START VALIDATION
    if (!assignment.startedAt) {
      throw new BadRequestException('Assessment start time missing');
    }

    // DURATION VALIDATION
    const duration = assignment.assessment?.durationMinutes;

    if (duration) {
      const expiresAt = new Date(
        assignment.startedAt.getTime() + duration * 60 * 1000,
      );

      const now = new Date();

      if (now > expiresAt) {
        await this.prisma.candidateAssessment.update({
          where: {
            id: assignment.id,
          },

          data: {
            status: CandidateAssessmentStatus.EXPIRED,
          },
        });

        throw new BadRequestException('Assessment duration exceeded');
      }
    }

    // EVALUATE
    const evaluated = await this.evaluationService.evaluateMcqs({
      candidateAssessmentId: dto.candidateAssessmentId,

      answers: dto.answers,
    });

    console.log('evaluated:', evaluated);

    // SAVE RESPONSES
    await this.prisma.response.createMany({
      data: evaluated.responses.map((response) => ({
        candidateAssessmentId: dto.candidateAssessmentId,
        mcqQuestionId: response.mcqQuestionId,
        selectedOption: response.selectedOption,
        isCorrect: response.isCorrect,
        score: response.score,
      })),
    });

    // SUBMIT
    const updated = await this.prisma.candidateAssessment.update({
      where: {
        id: dto.candidateAssessmentId,
      },

      data: {
        status: CandidateAssessmentStatus.EVALUATED,
        submittedAt: new Date(),
        evaluatedAt: new Date(),
        mcqScore: evaluated.percentage,
        finalScore: evaluated.percentage,
        skillBreakdown: evaluated.skillBreakdown,
      },
    });

    // UPDATE USER SKILL PROFILE
    await this.updateUserSkillProfile(assignment.candidateId);

    return {
      score: evaluated.percentage,
      correct: evaluated.correct,
      wrong: evaluated.wrong,
      skillBreakdown: evaluated.skillBreakdown,
      status: updated.status,
    };
  }

  // GET BY ID (CANDIDATE SAFE RESPONSE)
  async getById(id: string) {
    const assignment = await this.prisma.candidateAssessment.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
        status: true,
        startedAt: true,
        submittedAt: true,
        expiresAt: true,
        createdAt: true,
        assessment: {
          select: {
            id: true,
            role: true,
            difficulty: true,
            mcqCount: true,
            codingCount: true,
            primarySkills: true,
            secondarySkills: true,
            focusAreas: true,
            mcqs: {
              select: {
                id: true,
                question: true,
                options: true,
              },
            },

            codingQuestions: {
              select: {
                id: true,
                title: true,
                problem: true,
                constraints: true,
                sampleInput: true,
                sampleOutput: true,
              },
            },
          },
        },

        responses: {
          select: {
            id: true,
            mcqQuestionId: true,
            codingQuestionId: true,
            selectedOption: true,
            codingAnswer: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!assignment) {
      throw new NotFoundException('Candidate assessment not found');
    }

    return assignment;
  }

  // GET CANDIDATE ASSESSMENTS
  async getCandidateAssessments(candidateId: string) {
    const assignments = await this.prisma.candidateAssessment.findMany({
      where: {
        candidateId,
      },

      select: {
        id: true,
        status: true,
        mcqScore: true,
        codingScore: true,
        aiScore: true,
        finalScore: true,
        startedAt: true,
        submittedAt: true,
        expiresAt: true,
        createdAt: true,
        assessment: {
          select: {
            id: true,
            role: true,
            difficulty: true,
            mcqCount: true,
            codingCount: true,
            primarySkills: true,
            focusAreas: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    if (assignments.length == 0) {
      throw new NotFoundException('No assignments found');
    }

    return assignments;
  }

  private async updateUserSkillProfile(candidateId: string) {
    const assessments = await this.prisma.candidateAssessment.findMany({
      where: {
        candidateId,

        status: 'EVALUATED',
      },

      select: {
        skillBreakdown: true,

        finalScore: true,
      },
    });

    const skillAccumulator: Record<
      string,
      {
        total: number;
        count: number;
      }
    > = {};

    let totalScore = 0;

    let totalAssessments = 0;

    for (const assessment of assessments) {
      if (assessment.finalScore) {
        totalScore += assessment.finalScore;

        totalAssessments++;
      }

      const breakdown = assessment.skillBreakdown as Record<string, number>;

      if (!breakdown) {
        continue;
      }

      for (const skill in breakdown) {
        if (!skillAccumulator[skill]) {
          skillAccumulator[skill] = {
            total: 0,
            count: 0,
          };
        }

        skillAccumulator[skill].total += breakdown[skill];

        skillAccumulator[skill].count += 1;
      }
    }

    const overallSkillScores: Record<string, number> = {};

    for (const skill in skillAccumulator) {
      const data = skillAccumulator[skill];

      overallSkillScores[skill] = Number((data.total / data.count).toFixed(2));
    }

    const overallAssessmentScore =
      totalAssessments > 0
        ? Number((totalScore / totalAssessments).toFixed(2))
        : 0;

    await this.prisma.user.update({
      where: {
        id: candidateId,
      },

      data: {
        overallSkillScores,
        overallAssessmentScore,
      },
    });
  }
}
