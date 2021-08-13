import { Module, Global } from '@nestjs/common';

import { CreditModule } from '../credit/credit.module';
import { ApiKeyModule } from '../api-key/api-key.module';
import { UsageService } from './usage.service';

@Global()
@Module({
  providers: [UsageService],
  exports: [UsageService],
  imports: [ApiKeyModule, CreditModule],
})
export class UsageModule {}
