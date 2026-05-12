import { ApiProperty } from '@nestjs/swagger';

/* =========================
   Request DTO
========================= */

export class GenerateAssessmentDto {
  @ApiProperty({
    example: 'Node',
    description: 'Technology or topic for the assessment',
  })
  topic: string;

  @ApiProperty({
    example: 'medium',
    description: 'Difficulty level of the assessment',
  })
  difficulty: 'easy' | 'medium' | 'hard';

  @ApiProperty({
    example: 1,
    description: 'Number of MCQ questions to generate',
  })
  mcqCount: number;

  @ApiProperty({
    example: 1,
    description: 'Number of coding questions to generate',
  })
  codingCount: number;
}

/* =========================
   Response DTOs
========================= */

export class McqDto {
  @ApiProperty({
    example:
      'Which of the following is a correct way to import a module in Node.js?',
    description: 'MCQ question',
  })
  question: string;

  @ApiProperty({
    example: [
      "A) require('module-name');",
      "B) import 'module-name';",
      "C) include 'module-name';",
      "D) use 'module-name';",
    ],
    description: 'Available answer options',
  })
  options: string[];

  @ApiProperty({
    example: 'A',
    description: 'Correct answer option',
  })
  correctAnswer: string;

  @ApiProperty({
    example: 'medium',
    description: 'Difficulty level of the MCQ',
  })
  difficulty: string;

  @ApiProperty({
    example:
      'In Node.js, the `require` function is used to load and return the exports of a module. The other options are not valid syntax for importing modules in Node.js.',
    description: 'Explanation of the correct answer',
  })
  explanation: string;
}

export class CodingQuestionDto {
  @ApiProperty({
    example: 'File Reader',
    description: 'Title of the coding problem',
  })
  title: string;

  @ApiProperty({
    example:
      'Write a Node.js program that reads a file from disk, counts the number of lines, and prints the total line count to the console. The path to the file will be provided as an argument when running the script.',
    description: 'Detailed coding problem statement',
  })
  problem: string;

  @ApiProperty({
    example:
      'The solution should handle errors gracefully and not crash if the file does not exist or is unreadable. Assume the file contains only text data with newlines separating each line.',
    description: 'Constraints for solving the problem',
  })
  constraints: string;

  @ApiProperty({
    example: './path/to/file.txt',
    description: 'Sample input for the coding problem',
  })
  sampleInput: string;

  @ApiProperty({
    example: 'Total lines: 100',
    description: 'Expected sample output',
  })
  sampleOutput: string;

  @ApiProperty({
    example:
      'Use fs.readFile() to read the file, split the content by newline characters, and count the number of elements in the resulting array. Handle errors using try-catch blocks.',
    description: 'Suggested approach to solve the problem',
  })
  expectedApproach: string;

  @ApiProperty({
    example: 'medium',
    description: 'Difficulty level of the coding question',
  })
  difficulty: string;
}

export class GenerateAssessmentResponseDto {
  @ApiProperty({
    type: [McqDto],
    description: 'List of generated MCQ questions',
  })
  mcqs: McqDto[];

  @ApiProperty({
    type: [CodingQuestionDto],
    description: 'List of generated coding questions',
  })
  coding: CodingQuestionDto[];
}
