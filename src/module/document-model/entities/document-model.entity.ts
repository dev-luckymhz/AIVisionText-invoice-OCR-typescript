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

  @CreateDateColumn()
  uploadDate: Date;

  @Column({ type: 'varchar', length: 255, nullable: false })
  documentUrl: string;

  @ManyToOne(() => User, (user) => user.documents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(
    () => ExtractedDatum,
    (extractedData) => extractedData.documentModel,
  )
  extractedData: ExtractedDatum[]; // Define the relationship with ExtractedData
}
