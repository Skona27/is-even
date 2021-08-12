import {
  Controller,
  Post,
  Get,
  HttpStatus,
  Body,
  Request,
  HttpException,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { RequestWithUser } from '../common/interface/request-with-user.interface';
import { Authorised } from '../auth/auth.decorator';
import { CreditService } from './credit.service';
import { CreateCreditDto } from './dto/create-credit.dto';

import { ReadCreditError } from './error/read-credit.error';
import { CreateCreditError } from './error/create-credit.error';
import { CreditDto } from './dto/credit.dto';

@Controller('credits')
export class CreditController {
  constructor(private readonly creditService: CreditService) {}

  @Get('/')
  @Authorised()
  @ApiTags('credits')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credits successfully retrieved',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  public async getCredits(
    @Request() request: RequestWithUser,
  ): Promise<CreditDto[]> {
    try {
      const user = request.user;
      const credits = await this.creditService.getCredits(user);

      return credits.map((credit) => CreditDto.createDtoFromEntity(credit));
    } catch (error) {
      if (error instanceof ReadCreditError) {
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/')
  @Authorised()
  @ApiTags('credits')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credit has been created',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  public async createCredit(
    @Body() createCreditDto: CreateCreditDto,
    @Request() request: RequestWithUser,
  ): Promise<CreditDto> {
    try {
      const user = request.user;
      const { limit, duration } = createCreditDto;

      const credit = await this.creditService.createCredit(
        limit,
        duration,
        user,
      );

      return CreditDto.createDtoFromEntity(credit);
    } catch (error) {
      if (error instanceof CreateCreditError) {
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
