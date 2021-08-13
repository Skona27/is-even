import { applyDecorators, UseGuards } from '@nestjs/common';
import { UsageGuard } from './usage.guard';

export function TrackUsage() {
  return applyDecorators(UseGuards(UsageGuard));
}
