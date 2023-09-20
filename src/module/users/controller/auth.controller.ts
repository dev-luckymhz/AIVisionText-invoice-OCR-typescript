import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express'; // Import the Response object
import { UserService } from '../service/users.service';
import { AuthService } from '../service/auth.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from '../guard/auth.guard';

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
      response.cookie('token', token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 2 * 60 * 60 * 1000,
      });

      // You can customize the response if login is successful
      return { message: 'Login successful', user };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('authenticated-user')
  async getAuthenticatedUser(@Req() request: Request) {
    try {
      const userId = request['user'].sub; // Extract user ID from the JWT payload
      return await this.authService.getAuthenticatedUser(userId);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Post('change-password')
  async changePassword(
    @Req() request: Request,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    try {
      const userId = request['user'].sub; // Extract user ID from the JWT payload
      const user = await this.authService.getAuthenticatedUser(userId);

      // Verify the old password
      const isOldPasswordValid = await bcrypt.compare(
        oldPassword,
        user.password,
      );

      if (!isOldPasswordValid) {
        throw new UnauthorizedException('Old password is incorrect');
      }

      // Hash and update the new password
      await this.authService.changePassword(userId, newPassword);

      return { message: 'Password changed successfully' };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
