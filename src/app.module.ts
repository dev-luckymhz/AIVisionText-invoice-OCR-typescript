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
import { DocumentModel } from './module/document-model/entities/document-model.entity';
import { ExtractedDataModule } from './module/extracted-data/extracted-data.module';
import { ExtractedDatum } from './module/extracted-data/entities/extracted-datum.entity';
import { DocumentCategoryModule } from './module/document-category/document-category.module';
import { DocumentCategory } from './module/document-category/entities/document-category.entity';
import { DocumentMetadataModule } from './module/document-metadata/document-metadata.module';
import { DocumentMetadatum } from './module/document-metadata/entities/document-metadatum.entity';
import { LogementModule } from './module/logement/logement.module';
import { AppartementModule } from './module/appartement/appartement.module';
import { Apartment } from './module/appartement/entities/appartement.entity';
import { Logement } from './module/logement/entities/logement.entity';
import { AuditModule } from './module/audit/audit.module';
import { AuditEntity } from './module/audit/entities/audit.entity';
import { InvoiceModule } from './module/invoice/invoice.module';
import { Invoice } from './module/invoice/entities/invoice.entity';
import { Product } from './module/invoice/product/entities/product.entity';
import { ContractModule } from './module/contract/contract.module';
import { Contract } from './module/contract/entities/contract.entity';

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
      entities: [
        User,
        UserRole,
        DocumentModel,
        ExtractedDatum,
        DocumentCategory,
        DocumentMetadatum,
        Apartment,
        Logement,
        AuditEntity,
        Invoice,
        Product,
        Contract,
      ],
      synchronize: true,
    }),
    UsersModule,
    DocumentModelModule,
    ExtractedDataModule,
    DocumentCategoryModule,
    DocumentMetadataModule,
    LogementModule,
    AppartementModule,
    AuditModule,
    InvoiceModule,
    ContractModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
