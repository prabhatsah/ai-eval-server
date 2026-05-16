import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { userIdParamSchema } from './validators/user.schema';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: [UserDto],
  })
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: UserDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getUserById(
    @Param(new ZodValidationPipe(userIdParamSchema)) params: { id: string },
  ) {
    return this.userService.findById(params.id);
  }
}
