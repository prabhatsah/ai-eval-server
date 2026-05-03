import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class SectionConfigDto {
  @ApiProperty({ example: 0.5, minimum: 0, maximum: 1 })
  @IsNumber({}, { message: 'Weight must be a number' })
  @Min(0, { message: 'Weight cannot be less than 0' })
  @Max(1, { message: 'Weight cannot be more than 1' })
  weight!: number;
}

class SectionsDto {
  @ApiProperty({ type: SectionConfigDto })
  @ValidateNested()
  @Type(() => SectionConfigDto)
  AI!: SectionConfigDto;

  @ApiProperty({ type: SectionConfigDto })
  @ValidateNested()
  @Type(() => SectionConfigDto)
  MCQ!: SectionConfigDto;

  @ApiProperty({ type: SectionConfigDto })
  @ValidateNested()
  @Type(() => SectionConfigDto)
  CODING!: SectionConfigDto;
}

export class CreateEvaluationDto {
  @ApiProperty({ example: 'Frontend Assessment' })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  title!: string;

  @ApiProperty({ example: 'React' })
  @IsString({ message: 'Skill must be a string' })
  skill!: string;

  @ApiProperty({ type: SectionsDto })
  @ValidateNested()
  @Type(() => SectionsDto)
  sections!: SectionsDto;

  @ApiProperty({ example: 60, minimum: 0, maximum: 100 })
  @IsNumber({}, { message: 'Passing score must be a number' })
  @Min(0, { message: 'Passing score cannot be less than 0' })
  @Max(100, { message: 'Passing score cannot be more than 100' })
  passingScore!: number;
}
