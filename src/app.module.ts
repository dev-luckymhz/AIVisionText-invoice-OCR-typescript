import { Module } from '@nestjs/common';
import { AppController } from './shared/app.controller';
import { AppService } from './shared/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './module/users/users.module';
import configuration from '../config/config';
import { User } from './module/users/entities/user.entity';
import { UserRole } from './module/users/entities/user-role.entity';
import { DocumentModelModule } from './module/document-model/document-model.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 3306) || 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, UserRole],
      synchronize: true,
    }),
    UsersModule,
    DocumentModelModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
