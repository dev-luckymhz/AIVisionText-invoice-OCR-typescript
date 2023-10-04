import { Module } from '@nestjs/common';
import { AppartementService } from './appartement.service';
import { AppartementController } from './appartement.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentModel } from '../document-model/entities/document-model.entity';
import { User } from '../users/entities/user.entity';
import { Appartement } from './entities/appartement.entity';
import { Logement } from '../logement/entities/logement.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentModel, User, Appartement, Logement]),
  ],
  controllers: [AppartementController],
  providers: [AppartementService],
})
export class AppartementModule {}
