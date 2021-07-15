import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiTags('health')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Application is running',
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
