import { ApiProperty } from '@nestjs/swagger';

import { IsInt, IsUUID, Max, Min } from 'class-validator';

export class CreateAssessmentDto {
  @ApiProperty({
    example: '1203e303-762a-4a36-8271-b2f43ba83991',
  })
  @IsUUID()
  jdId: string;

  @ApiProperty({
    example: 10,
  })
  @IsInt()
  @Min(1)
  @Max(50)
  mcqCount: number;

  @ApiProperty({
    example: 2,
  })
  @IsInt()
  @Min(0)
  @Max(10)
  codingCount: number;
}
