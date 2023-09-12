import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './users.service';
import { LoginUserDto } from '../dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(loginUserDto: LoginUserDto) {
    const { username, password } = loginUserDto;

    // Find the user by username
    const user = await this.userService.findByUsername(username);

    // Validate the user's password (you should hash and compare securely)
    if (user && user.password === password) {
      return user;
    }

    return null; // Return null if the user is not found or the password is incorrect
  }

  async generateToken(user) {
    const payload = { sub: user.id, username: user.username };

    // Generate and sign a JWT token with the payload
    return this.jwtService.sign(payload);
  }
}
