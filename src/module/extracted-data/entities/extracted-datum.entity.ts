import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
} from 'typeorm';
import { DocumentModel } from '../../document-model/entities/document-model.entity'; // Import the Document entity

@Entity()
export class ExtractedData extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DocumentModel, (document) => document.extractedData)
  document: DocumentModel;

  @Column({ nullable: true })
  vendorName: string;

  @Column({ nullable: true })
  invoiceNumber: string;

  @Column({ type: 'date', nullable: true })
  date: Date;

  @Column({ type: 'float', nullable: true })
  totalAmount: number;

  @Column({ nullable: true })
  description: string;

  // @Column({ type: 'float', nullable: true })
  // quantity: number;

  // @Column({ type: 'float', nullable: true })
  // unitPrice: number;

  // @Column({ type: 'float', nullable: true })
  // lineTotal: number;
}
