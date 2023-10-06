import { Module } from '@nestjs/common';
import { LogementService } from './logement.service';
import { LogementController } from './logement.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Apartment } from '../appartement/entities/appartement.entity';
import { Logement } from './entities/logement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Apartment, Logement])],
  controllers: [LogementController],
  providers: [LogementService],
})
export class LogementModule {}
