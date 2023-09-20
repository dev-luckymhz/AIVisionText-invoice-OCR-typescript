import { Module } from '@nestjs/common';
import { UserService } from './service/users.service';
import { UserController } from './controller/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserRole } from './entities/user-role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRole]),
    JwtModule.register({
      global: true,
      secret: 'test_secret',
      privateKey: 'test_private',
    }),
  ],
  controllers: [UserController, AuthController],
  providers: [UserService, AuthService, JwtService],
})
export class UsersModule {}
