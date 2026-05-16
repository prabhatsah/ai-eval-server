import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateJdDto {
  @ApiProperty({
    example: 'We are looking for a Backend Engineer...',
    description: 'Full job description text',
  })
  @IsString()
  @IsNotEmpty()
  jd: string;
}

export class JdResponseDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  role: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  primarySkills: string[];

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  secondarySkills?: string[];

  @ApiProperty({ enum: ['easy', 'medium', 'hard'] })
  @IsEnum(['easy', 'medium', 'hard'])
  difficulty: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  experienceYears?: number;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  focusAreas?: string[];
}
