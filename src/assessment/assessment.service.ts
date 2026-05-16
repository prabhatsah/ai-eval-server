import { Injectable, NotFoundException } from '@nestjs/common';

import { randomUUID } from 'crypto';
import { AssessmentEntity } from './validators/assessment.schema';

@Injectable()
export class AssessmentService {
  private readonly assessments: AssessmentEntity[] = [];

  create(data: Omit<AssessmentEntity, 'id' | 'createdAt'>): AssessmentEntity {
    const newAssessment: AssessmentEntity = {
      ...data,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };

    this.assessments.push(newAssessment);

    return newAssessment;
  }

  findAll(): AssessmentEntity[] {
    return this.assessments;
  }

  findById(id: string): AssessmentEntity {
    const result = this.assessments.find((a) => a.id === id);

    if (!result) {
      throw new NotFoundException('Assessment not found');
    }

    return result;
  }

  delete(id: string) {
    const index = this.assessments.findIndex((a) => a.id === id);

    if (index === -1) {
      throw new NotFoundException('Assessment not found');
    }

    this.assessments.splice(index, 1);

    return { message: 'Deleted successfully' };
  }
}
``;
