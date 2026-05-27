import { ApiProperty } from '@nestjs/swagger';
import { Difficulty } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ParseJdDto {
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

  @ApiProperty({ enum: Difficulty })
  @IsEnum(Difficulty)
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
