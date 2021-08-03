import {
  Controller,
  Post,
  HttpStatus,
  HttpException,
  Body,
  Get,
  Req,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { CognitoLoginUserError } from '../cognito/error/cognito-login-user.error';
import { CognitoCreateUserError } from '../cognito/error/cognito-create-user.error';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserWithAuth } from './interface/user-with-auth.interface';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Authorised } from '../auth/auth.decorator';
import { RequestWithUser } from '../common/interface/request-with-user.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  @ApiTags('users')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User has been successfully created',
  })
  @ApiResponse({
    status: HttpStatus.SERVICE_UNAVAILABLE,
    description: 'Third party service error',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request',
  })
  public async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    const { firstName, lastName, email, password } = createUserDto;
    try {
      return await this.userService.createUser(
        firstName,
        lastName,
        email,
        password,
      );
    } catch (error) {
      if (error instanceof CognitoCreateUserError) {
        throw new HttpException(
          'Service temporary unavailable',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  @ApiTags('users')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User has been successfully logged in',
  })
  @ApiResponse({
    status: HttpStatus.SERVICE_UNAVAILABLE,
    description: 'Third party service error',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request',
  })
  public async loginUser(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<UserWithAuth> {
    const { email, password } = loginUserDto;
    try {
      return await this.userService.loginUser(email, password);
    } catch (error) {
      if (error instanceof CognitoLoginUserError) {
        throw new HttpException(
          'Service temporary unavailable',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('me')
  @Authorised()
  @ApiTags('users')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User data has been successfully retrieved',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  public async me(@Req() request: RequestWithUser): Promise<User> {
    try {
      return request.user;
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
