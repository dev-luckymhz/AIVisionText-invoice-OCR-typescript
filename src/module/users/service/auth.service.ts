import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './users.service';
import { LoginUserDto } from '../dto/login-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    // Find the user by username
    const user = await this.userService.findByEmail(email);

    if (user) {
      // Use bcrypt to compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        return user;
      }
    }

    return null; // Return null if the user is not found or the password is incorrect
  }

  async generateToken(user) {
    const payload = {
      sub: user.id,
      username: user.username,
      role: user?.role, // Include the user's role in the payload
    };

    // Generate and sign a JWT token with the payload
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });
  }

  async getAuthenticatedUser(userId: number) {
    try {
      return await this.userService.findById(userId);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async changePassword(userId: number, newPassword: string) {
    try {
      const user = await this.userService.findById(userId);
      user.password = await bcrypt.hash(newPassword, 10);
      await this.userService.update(userId, user);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
