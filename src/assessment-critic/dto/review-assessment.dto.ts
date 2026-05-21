import { IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class ReviewAssessmentDto {
  @ApiProperty({
    example: '1203e303-762a-4a36-8271-b2f43ba83991',
  })
  @IsUUID()
  assessmentId: string;
}
