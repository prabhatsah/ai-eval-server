import { IsUUID, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignAssessmentDto {
  @ApiProperty({
    example: '1203e303-762a-4a36-8271-b2f43ba83991',
  })
  @IsUUID()
  candidateId: string;

  @ApiProperty({
    example: '4000eced-68f1-42ba-bee7-7cf4e818eb52',
  })
  @IsUUID()
  assessmentId: string;

  @ApiProperty({
    required: false,
    example: '2026-06-01T12:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
