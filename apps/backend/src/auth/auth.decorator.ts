import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth.guard';

export function Authorised() {
  return applyDecorators(UseGuards(JwtAuthGuard));
}
