import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiBadRequestResponse } from '@nestjs/swagger';

import { TrackUsage } from '../usage/track-usage.decorator';
import { IsEvenDto } from './dto/is-even.dto';

@Controller()
export class AppController {
  @Get()
  @ApiTags('health')
  @ApiOkResponse({
    description: 'Health check',
  })
  public check(): string {
    return 'Ok';
  }

  @Get('/is-even/:number')
  @TrackUsage()
  @ApiTags('is-even')
  @ApiOkResponse({
    type: IsEvenDto,
    description: 'Number parsed',
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  public async analyze(@Param('number') number: number): Promise<IsEvenDto> {
    if (Number.isNaN(number)) {
      throw new BadRequestException(`${number} is not a number`);
    }

    return {
      isEven: number % 2 === 0,
    };
  }
}
