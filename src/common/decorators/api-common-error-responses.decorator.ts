import { applyDecorators } from '@nestjs/common';

import { ApiResponse } from '@nestjs/swagger';
import { ApiErrorResponseDto } from '../dto/api-error-response.dto';

export function ApiCommonErrorResponses() {
  return applyDecorators(
    ApiResponse({
      status: 400,
      description: 'Error response structure',
      type: ApiErrorResponseDto,
    }),
  );
}
