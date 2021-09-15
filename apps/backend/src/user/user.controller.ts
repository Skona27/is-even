import {
  Controller,
  Post,
  HttpStatus,
  HttpException,
  Body,
  Get,
  Req,
  BadRequestException,
  ForbiddenException,
  HttpCode,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { CognitoCreateUserError } from '../cognito/error/cognito-create-user.error';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserWithAuth } from './interface/user-with-auth.interface';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Authorised } from '../auth/auth.decorator';
import { RequestWithUser } from '../common/interface/request-with-user.interface';
import { LoginUserError } from './error/login-user.error';
import { RefreshUserTokenDto } from './dto/refresh-user-token.dto';
import { LogoutUserDto } from './dto/logout-user.dto';

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
      return await this.userService.loginWithCredentials(email, password);
    } catch (error) {
      if (error instanceof LoginUserError) {
        throw new BadRequestException('Invalid email or password');
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('refresh')
  @ApiTags('users')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token has been successfully refreshed',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request',
  })
  public async refreshUserToken(
    @Body() refreshUserTokenDto: RefreshUserTokenDto,
  ): Promise<UserWithAuth> {
    const { refreshToken } = refreshUserTokenDto;
    try {
      return await this.userService.loginWithToken(refreshToken);
    } catch (error) {
      if (error instanceof LoginUserError) {
        throw new BadRequestException('Invalid token');
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  @Authorised()
  @ApiTags('users')
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'User has been successfully logout',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access forbidden',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request',
  })
  public async logoutUser(
    @Req() request: RequestWithUser,
    @Body() logoutUserDto: LogoutUserDto,
  ): Promise<void> {
    const { email } = logoutUserDto;
    const user = request.user;

    if (user.email !== email) {
      throw new ForbiddenException('Access forbidden');
    }

    try {
      return await this.userService.logoutUser(email);
    } catch (error) {
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
