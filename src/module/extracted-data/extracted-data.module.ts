import { Module } from '@nestjs/common';
import { ExtractedDataService } from './extracted-data.service';
import { ExtractedDataController } from './extracted-data.controller';

@Module({
  controllers: [ExtractedDataController],
  providers: [ExtractedDataService],
})
export class ExtractedDataModule {}
