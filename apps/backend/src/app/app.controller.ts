import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get()
  @ApiTags('health')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Health check',
  })
  check(): string {
    return 'Ok';
  }
}
