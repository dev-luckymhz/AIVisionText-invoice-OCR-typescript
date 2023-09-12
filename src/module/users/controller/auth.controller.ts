import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Res,
} from '@nestjs/common';
import { Response } from 'express'; // Import the Response object
import { UserService } from '../service/users.service';
import { AuthService } from '../service/auth.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);
      // You can customize the response if registration is successful
      return { message: 'Registration successful', user };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const user = await this.authService.validateUser(loginUserDto);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const token = await this.authService.generateToken(user);

      // Set the JWT token as a cookie in the response
      response.cookie('token', token, { httpOnly: true, sameSite: 'strict' });

      // You can customize the response if login is successful
      return { message: 'Login successful', user };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
