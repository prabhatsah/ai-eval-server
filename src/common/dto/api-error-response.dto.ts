import { ApiProperty } from '@nestjs/swagger';

export class ApiErrorResponseDto {
  @ApiProperty({
    example: false,
  })
  success: boolean;

  @ApiProperty({
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    example: 'Gemini API key is missing',
  })
  message: string;

  @ApiProperty({
    example: null,
    nullable: true,
  })
  errors: any;

  @ApiProperty({
    example: null,
    nullable: true,
  })
  details: any;

  @ApiProperty({
    example: '2026-05-12T17:15:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    example: '/ai/generate-assessment',
  })
  path: string;
}
