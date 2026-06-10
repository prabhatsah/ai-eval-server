import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AssignAssessmentDto } from '../dto/assign-assessment.dto';
import {
  CandidateAssessmentSchema,
  SaveCodingAnswerInput,
} from '../validators/candidate-assessment.schema';
import { AssessmentStatus, CandidateAssessmentStatus } from '@prisma/client';
import { EvaluationService } from 'src/evaluation/evaluation.service';
import { SubmitAssessmentDto } from '../dto/submit-assessment.dto';
import {
  AssessmentAssignmentOverviewSchema,
  CandidateByAssessmentSchema,
  CandidateDetailedResultSchema,
} from '../validators/manager-candidate-assessment.schema';
import { JwtUser } from 'src/auth/interfaces/jwt-payload.interface';
import { duration } from 'zod/v4/classic/iso.cjs';
import { McqAnswerDto } from '../dto/save-mcq-answer.dto';
import { CodingAnswerDto } from '../dto/save-coding-answer.dto';

@Injectable()
export class CandidateAssessmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly evaluationService: EvaluationService,
  ) {}

  //////////////////////////////////////////////////////
  // ASSIGN ASSESSMENT
  //////////////////////////////////////////////////////

  async assignAssessment(user: JwtUser, dto: AssignAssessmentDto) {
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
        createdById: user.userId,
        status: AssessmentStatus.APPROVED,
      },
    });

    if (!assessment) {
      throw new NotFoundException('No approved assessment found');
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
        createdById: user.userId,
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
  async startAssessment(user: JwtUser, candidateAssessmentId: string) {
    const assignment = await this.prisma.candidateAssessment.findUnique({
      where: {
        id: candidateAssessmentId,
        candidateId: user.userId,
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
  // async submitAssessment1(user: JwtUser, dto: SubmitAssessmentDto) {
  //   const assignment = await this.prisma.candidateAssessment.findUnique({
  //     where: {
  //       id: dto.candidateAssessmentId,
  //       candidateId: user.userId,
  //     },
  //     include: {
  //       assessment: {
  //         select: {
  //           durationMinutes: true,
  //         },
  //       },
  //     },
  //   });

  //   if (!assignment) {
  //     throw new NotFoundException('Candidate assessment not found');
  //   }

  //   // STATUS VALIDATION
  //   if (assignment.status !== CandidateAssessmentStatus.IN_PROGRESS) {
  //     throw new BadRequestException('Assessment is not in progress');
  //   }

  //   // START VALIDATION
  //   if (!assignment.startedAt) {
  //     throw new BadRequestException('Assessment start time missing');
  //   }

  //   // DURATION VALIDATION
  //   const duration = assignment.assessment?.durationMinutes;

  //   if (duration) {
  //     const expiresAt = new Date(
  //       assignment.startedAt.getTime() + duration * 60 * 1000,
  //     );

  //     const now = new Date();

  //     if (now > expiresAt) {
  //       await this.prisma.candidateAssessment.update({
  //         where: {
  //           id: assignment.id,
  //         },

  //         data: {
  //           status: CandidateAssessmentStatus.EXPIRED,
  //         },
  //       });

  //       throw new BadRequestException('Assessment duration exceeded');
  //     }
  //   }

  //   // EVALUATE
  //   const evaluated = await this.evaluationService.evaluateMcqs({
  //     candidateAssessmentId: dto.candidateAssessmentId,
  //     answers: dto.answers,
  //   });

  //   // SAVE RESPONSES
  //   await this.prisma.response.createMany({
  //     data: evaluated.responses.map((response) => ({
  //       candidateAssessmentId: dto.candidateAssessmentId,
  //       mcqQuestionId: response.mcqQuestionId,
  //       selectedOptionIndex: response.selectedOptionIndex,
  //       isCorrect: response.isCorrect,
  //       score: response.score,
  //     })),
  //   });

  //   // SUBMIT
  //   const updated = await this.prisma.candidateAssessment.update({
  //     where: {
  //       id: dto.candidateAssessmentId,
  //     },

  //     data: {
  //       status: CandidateAssessmentStatus.EVALUATED,
  //       submittedAt: new Date(),
  //       evaluatedAt: new Date(),
  //       mcqScore: evaluated.percentage,
  //       finalScore: evaluated.percentage,
  //       skillBreakdown: evaluated.skillBreakdown,
  //     },
  //   });

  //   // UPDATE USER SKILL PROFILE
  //   await this.updateUserSkillProfile(assignment.candidateId);

  //   return {
  //     score: evaluated.percentage,
  //     correct: evaluated.correct,
  //     wrong: evaluated.wrong,
  //     skillBreakdown: evaluated.skillBreakdown,
  //     status: updated.status,
  //   };
  // }

  async submitAssessment(user: JwtUser, dto: SubmitAssessmentDto) {
    // FETCH ASSIGNMENT
    const assignment = await this.prisma.candidateAssessment.findUnique({
      where: {
        id: dto.candidateAssessmentId,
        candidateId: user.userId,
      },

      include: {
        assessment: true,
      },
    });

    if (!assignment) {
      throw new NotFoundException('Candidate assessment not found');
    }

    // STATUS CHECK
    if (assignment.status !== CandidateAssessmentStatus.IN_PROGRESS) {
      throw new BadRequestException('Assessment is not in progress');
    }

    // DURATION CHECK
    const durationMinutes = assignment.assessment.durationMinutes;

    if (durationMinutes) {
      const elapsedMinutes =
        (Date.now() - assignment.startedAt!.getTime()) / 1000 / 60;

      if (elapsedMinutes > durationMinutes) {
        throw new BadRequestException('Assessment duration exceeded');
      }
    }

    // FETCH RESPONSES
    const responses = await this.prisma.response.findMany({
      where: {
        candidateAssessmentId: assignment.id,
      },
      select: {
        mcqQuestionId: true,
        selectedOptionIndex: true,
      },
    });

    // MCQ EVALUATION
    const mcqResponses = responses.filter(
      (r): r is { mcqQuestionId: string; selectedOptionIndex: number } =>
        r.mcqQuestionId !== null && r.selectedOptionIndex !== null,
    );

    const mcqResult = await this.evaluationService.evaluateMcqs({
      candidateAssessmentId: assignment.id,
      answers: mcqResponses,
    });

    //UPDATE THE MCQ SCORE IN THE RESPONSE TABLE
    await this.prisma.$transaction(
      mcqResult.responses.map((response) =>
        this.prisma.response.update({
          where: {
            candidateAssessmentId_mcqQuestionId: {
              candidateAssessmentId: dto.candidateAssessmentId,
              mcqQuestionId: response.mcqQuestionId,
            },
          },
          data: {
            selectedOptionIndex: response.selectedOptionIndex,
            isCorrect: response.isCorrect,
            score: response.score,
          },
        }),
      ),
    );

    // TODO: CODING EVALUATION
    const codingScore = 1;

    // FINAL SCORE
    const finalScore = mcqResult.percentage + codingScore;

    // UPDATE ASSESSMENT
    await this.prisma.candidateAssessment.update({
      where: {
        id: assignment.id,
      },

      data: {
        status: 'EVALUATED',
        submittedAt: new Date(),
        mcqScore: mcqResult.percentage,
        codingScore,
        finalScore,
        skillBreakdown: mcqResult.skillBreakdown,
      },
    });

    return {
      status: CandidateAssessmentStatus.EVALUATED,
      score: finalScore,
      mcqResult: {
        correct: mcqResult.correct,
        wrong: mcqResult.wrong,
        skillBreakdown: mcqResult.skillBreakdown,
      },
      codingResult: {
        passed: 0,
        failed: 0,
        timeLimitexceeded: 0,
      },
    };
  }

  // GET BY ID
  // async getById(id: string) {
  //   const assignment = await this.prisma.candidateAssessment.findUnique({
  //     where: {
  //       id,
  //     },

  //     select: {
  //       id: true,
  //       status: true,
  //       startedAt: true,
  //       submittedAt: true,
  //       expiresAt: true,
  //       createdAt: true,
  //       assessment: {
  //         select: {
  //           id: true,
  //           assessmentCode: true,
  //           role: true,
  //           difficulty: true,
  //           mcqCount: true,
  //           codingCount: true,
  //           primarySkills: true,
  //           secondarySkills: true,
  //           focusAreas: true,
  //           mcqs: {
  //             select: {
  //               id: true,
  //               question: true,
  //               options: true,
  //             },
  //           },
  //           codingQuestions: {
  //             select: {
  //               id: true,
  //               title: true,
  //               problem: true,
  //               constraints: true,
  //               sampleCases: true,
  //               expectedApproach: true,
  //               timeComplexity: true,
  //               spaceComplexity: true,
  //             },
  //           },
  //         },
  //       },
  //       responses: {
  //         select: {
  //           id: true,
  //           mcqQuestionId: true,
  //           codingQuestionId: true,
  //           selectedOptionIndex: true,
  //           isCorrect: true,
  //           codingAnswer: true,
  //           createdAt: true,
  //           updatedAt: true,
  //         },
  //       },
  //     },
  //   });

  //   if (!assignment) {
  //     throw new NotFoundException('Candidate assessment not found');
  //   }

  //   return assignment;
  // }

  // GET CANDIDATE ASSESSMENTS

  // Used by manager to get all assessments with all the candidates asoociated with it
  async getAssessmentsWithCandidates(user: JwtUser) {
    const assessments = await this.prisma.assessment.findMany({
      where: {
        createdById: user.userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        candidateAssessments: {
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            status: true,
            mcqScore: true,
            codingScore: true,
            aiScore: true,
            finalScore: true,
            skillBreakdown: true,
            startedAt: true,
            submittedAt: true,
            expiresAt: true,

            candidate: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },

            responses: {
              select: {
                id: true,
                mcqQuestionId: true,
                selectedOptionIndex: true,
                isCorrect: true,
              },
            },
          },
        },

        mcqs: {
          select: {
            id: true,
            question: true,
            skills: true,
            options: true,
            correctAnswerIndex: true,
          },
        },

        codingQuestions: {
          select: {
            id: true,
            title: true,
            problem: true,
            constraints: true,
            sampleCases: true,
            hiddenTestCases: true,
          },
        },
      },
    });

    return assessments.map((assessment) => ({
      assessmentId: assessment.id,
      assessmentCode: assessment.assessmentCode,
      durationMinutes: assessment.durationMinutes,
      primarySkills: assessment.primarySkills,
      secondarySkills: assessment.secondarySkills,
      role: assessment.role,
      difficulty: assessment.difficulty,
      mcqCount: assessment.mcqCount,
      codingCount: assessment.codingCount,
      createdAt: assessment.createdAt,
      candidateAssessmentDetails: assessment.candidateAssessments.map(
        (candidateAssessment) => ({
          candidateAssessmentId: candidateAssessment.id,
          candidateId: candidateAssessment.candidate.id,
          name: candidateAssessment.candidate.name,
          email: candidateAssessment.candidate.email,
          status: candidateAssessment.status,
          mcqScore: candidateAssessment.mcqScore,
          codingScore: candidateAssessment.codingScore,
          aiScore: candidateAssessment.aiScore,
          finalScore: candidateAssessment.finalScore,
          startedAt: candidateAssessment.startedAt,
          skillBreakdown: candidateAssessment.skillBreakdown,
          submittedAt: candidateAssessment.submittedAt,
          expiresAt: candidateAssessment.expiresAt,

          responses: candidateAssessment.responses.map((response) => ({
            id: response.id,
            mcqQuestionId: response.mcqQuestionId,
            selectedOptionIndex: response.selectedOptionIndex,
            isCorrect: response.isCorrect,
          })),
        }),
      ),

      mcqs: assessment.mcqs.map((mcq) => ({
        id: mcq.id,
        question: mcq.question,
        skills: mcq.skills,
        options: mcq.options,
        correctAnswerIndex: mcq.correctAnswerIndex,
      })),

      codingQuestions: assessment.codingQuestions.map((ques) => ({
        id: ques.id,
        title: ques.title,
        problem: ques.problem,
        constraints: ques.constraints,
        sampleCases: ques.sampleCases,
        hiddenTestCases: ques.hiddenTestCases,
      })),
    }));
  }

  // used by manager to get all assessment assigned to that candidate
  async getAllAssessmentAssignedToCandidate(
    user: JwtUser,
    candidateId: string,
  ) {
    const candidateAssessments = await this.prisma.candidateAssessment.findMany(
      {
        where: {
          candidateId,
          assessment: {
            createdById: user.userId,
          },
        },
        include: {
          assessment: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    );

    return candidateAssessments.map((assignment) => ({
      candidateAssessmentId: assignment.id,
      candidateId: assignment.candidateId,

      assessment: {
        id: assignment.assessment.id,
        role: assignment.assessment.role,
        assessmentCode: assignment.assessment.assessmentCode,
        durationMinutes: assignment.assessment.durationMinutes,
        primarySkills: assignment.assessment.primarySkills,
        secondarySkills: assignment.assessment.secondarySkills,
        difficulty: assignment.assessment.difficulty,
        mcqCount: assignment.assessment.mcqCount,
        codingCount: assignment.assessment.codingCount,
        createdAt: assignment.assessment.createdAt,
      },

      status: assignment.status,

      scores: {
        mcqScore: assignment.mcqScore,
        codingScore: assignment.codingScore,
        aiScore: assignment.aiScore,
        finalScore: assignment.finalScore,
      },

      startedAt: assignment.startedAt,
      submittedAt: assignment.submittedAt,
      evaluatedAt: assignment.evaluatedAt,
      expiresAt: assignment.expiresAt,

      skillBreakdown: assignment.skillBreakdown,
      evaluationSummary: assignment.evaluationSummary,
      feedback: assignment.feedback,
    }));
  }

  // used by manager to get specific assessment
  async getSpecificAssessmentForManager(user: JwtUser, id: string) {
    const assignment = await this.prisma.candidateAssessment.findUnique({
      where: {
        id,
        createdById: user.userId,
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
            assessmentCode: true,
            durationMinutes: true,
            role: true,
            difficulty: true,
            mcqCount: true,
            codingCount: true,
            primarySkills: true,
            secondarySkills: true,
            focusAreas: true,
          },
        },
      },
    });

    return assignment || [];
  }

  // Used by candidate to get all assessments which is assigned to them
  async getAllAssessmentAssignedToLoggedInCandidate(user: JwtUser) {
    const assignments = await this.prisma.candidateAssessment.findMany({
      where: {
        candidateId: user.userId,
      },
      select: {
        id: true,
        status: true,
        mcqScore: true,
        codingScore: true,
        aiScore: true,
        finalScore: true,
        skillBreakdown: true,
        startedAt: true,
        submittedAt: true,
        expiresAt: true,
        createdAt: true,

        assessment: {
          select: {
            id: true,
            assessmentCode: true,
            durationMinutes: true,
            role: true,
            difficulty: true,
            mcqCount: true,
            codingCount: true,
            primarySkills: true,
            focusAreas: true,
            mcqs: {
              select: {
                id: true,
                question: true,
                options: true,
                explanation: true,
                difficulty: true,
                skills: true,
              },
              orderBy: {
                createdAt: 'asc',
              },
            },
            codingQuestions: {
              select: {
                id: true,
                title: true,
                problem: true,
                constraints: true,
                sampleCases: true,
                hiddenTestCases: true,
                difficulty: true,
                // language: true,
                spaceComplexity: true,
                timeComplexity: true,
              },
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
        },

        responses: {
          select: {
            id: true,
            mcqQuestionId: true,
            selectedOptionIndex: true,
            isCorrect: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return assignments;
  }

  // Used by candidate to get one of the assigned assignment
  async getSpecificAssessmentForCandidate(user: JwtUser, id: string) {
    const assignment = await this.prisma.candidateAssessment.findUnique({
      where: {
        id,
        candidateId: user.userId,
      },
      select: {
        id: true,
        status: true,
        mcqScore: true,
        codingScore: true,
        aiScore: true,
        finalScore: true,
        skillBreakdown: true,
        startedAt: true,
        submittedAt: true,
        expiresAt: true,
        createdAt: true,
        assessment: {
          select: {
            id: true,
            assessmentCode: true,
            durationMinutes: true,
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
                explanation: true,
                difficulty: true,
                skills: true,
              },
              orderBy: {
                createdAt: 'asc',
              },
            },
            codingQuestions: {
              select: {
                id: true,
                title: true,
                problem: true,
                constraints: true,
                sampleCases: true,
                hiddenTestCases: true,
                difficulty: true,
                // language: true,
                spaceComplexity: true,
                timeComplexity: true,
              },
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
        },
      },
    });

    return assignment || [];
  }

  //Used by candidate to save mcq answers
  async saveMcqAnswer(dto: McqAnswerDto) {
    // CANDIDATE ASSESSMENT
    const candidateAssessment =
      await this.prisma.candidateAssessment.findUnique({
        where: {
          id: dto.candidateAssessmentId,
        },
      });

    if (!candidateAssessment) {
      throw new NotFoundException('Candidate assessment not found');
    }

    // STATUS VALIDATION
    if (candidateAssessment.status !== 'IN_PROGRESS') {
      throw new BadRequestException('Assessment is not in progress');
    }

    // QUESTION VALIDATION
    const question = await this.prisma.mcqQuestion.findFirst({
      where: {
        id: dto.mcqQuestionId,
        assessmentId: candidateAssessment.assessmentId,
      },
    });

    if (!question) {
      throw new NotFoundException(
        'Question does not belong to this assessment',
      );
    }

    // UPSERT RESPONSE
    const response = await this.prisma.response.upsert({
      where: {
        candidateAssessmentId_mcqQuestionId: {
          candidateAssessmentId: dto.candidateAssessmentId,
          mcqQuestionId: dto.mcqQuestionId,
        },
      },

      create: {
        candidateAssessmentId: dto.candidateAssessmentId,
        mcqQuestionId: dto.mcqQuestionId,
        selectedOptionIndex: dto.selectedOptionIndex,
      },

      update: {
        selectedOptionIndex: dto.selectedOptionIndex,
      },
    });

    return {
      message: 'MCQ answer saved successfully',
      responseId: response.id,
    };
  }

  //Used by candidate to save coding answers
  async saveCodingAnswer(dto: CodingAnswerDto) {
    // CANDIDATE ASSESSMENT
    const candidateAssessment =
      await this.prisma.candidateAssessment.findUnique({
        where: {
          id: dto.candidateAssessmentId,
        },
      });

    if (!candidateAssessment) {
      throw new NotFoundException('Candidate assessment not found');
    }

    // STATUS VALIDATION
    if (candidateAssessment.status !== 'IN_PROGRESS') {
      throw new BadRequestException('Assessment is not in progress');
    }

    // QUESTION VALIDATION
    const codingQuestion = await this.prisma.codingQuestion.findFirst({
      where: {
        id: dto.codingQuestionId,
        assessmentId: candidateAssessment.assessmentId,
      },
    });

    if (!codingQuestion) {
      throw new NotFoundException(
        'Coding question does not belong to this assessment',
      );
    }

    // UPSERT RESPONSE
    const response = await this.prisma.response.upsert({
      where: {
        candidateAssessmentId_codingQuestionId: {
          candidateAssessmentId: dto.candidateAssessmentId,
          codingQuestionId: dto.codingQuestionId,
        },
      },

      create: {
        candidateAssessmentId: dto.candidateAssessmentId,
        codingQuestionId: dto.codingQuestionId,
        codingAnswer: dto.codingAnswer,
      },

      update: {
        codingAnswer: dto.codingAnswer,
      },
    });

    return {
      message: 'Coding answer saved successfully',
      responseId: response.id,
    };
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
