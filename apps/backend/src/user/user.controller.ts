import {
  Controller,
  Post,
  HttpStatus,
  HttpException,
  Body,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { CognitoCreateUserError } from '../cognito/error/cognito-create-user.error';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiTags('users')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User has been successfully createds',
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
}
