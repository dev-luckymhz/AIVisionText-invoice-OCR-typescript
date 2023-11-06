import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  BaseEntity,
  OneToMany, // Import OneToMany
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ExtractedDatum } from '../../extracted-data/entities/extracted-datum.entity';
import { DocumentCategory } from '../../document-category/entities/document-category.entity';
import { DocumentMetadatum } from '../../document-metadata/entities/document-metadatum.entity';

@Entity()
export class DocumentModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  userId: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  fileName: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  fileType: string;

  @Column({ type: 'longtext', nullable: false })
  fileContent: string;

  @CreateDateColumn()
  uploadDate: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  documentUrl: string;

  @ManyToOne(() => User, (user) => user.documents, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => DocumentCategory, (category) => category.document)
  category: DocumentCategory; // Define the many-to-one relationship

  @OneToMany(
    () => ExtractedDatum,
    (extractedData) => extractedData.documentModel,
  )
  extractedData: ExtractedDatum[]; // Define the relationship with ExtractedData

  @OneToMany(() => DocumentMetadatum, (metadata) => metadata.document)
  metadata: DocumentMetadatum[]; // Define the one-to-many relationship
}
