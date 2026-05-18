import { ApiProperty } from '@nestjs/swagger';

export class GetAssessmentDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  difficulty: string;

  @ApiProperty()
  mcqCount: number;

  @ApiProperty()
  codingCount: number;

  @ApiProperty({
    type: [String],
  })
  primarySkills: string[];

  @ApiProperty({
    type: [String],
    required: false,
  })
  secondarySkills?: string[];

  @ApiProperty({
    type: [String],
    required: false,
  })
  focusAreas?: string[];
}
