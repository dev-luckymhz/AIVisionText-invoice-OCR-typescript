import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm';
import { DocumentModel } from '../../document-model/entities/document-model.entity';

@Entity()
export class DocumentMetadatum extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  fileContent: string;

  @ManyToOne(() => DocumentModel, (document) => document.metadata)
  @JoinColumn({ name: 'documentId' })
  document: DocumentModel;
}
