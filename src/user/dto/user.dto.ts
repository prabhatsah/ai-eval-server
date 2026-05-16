import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    example: 'uuid-string',
  })
  id: string;

  @ApiProperty({
    example: 'Prabhat Kumar',
  })
  name: string;

  @ApiProperty({
    example: 'prabhat@example.com',
  })
  email: string;

  @ApiProperty({
    enum: Role,
    example: Role.MANAGER,
  })
  role: Role;

  @ApiProperty({
    example: '2025-01-01T00:00:00.000Z',
  })
  createdAt: Date;
}
