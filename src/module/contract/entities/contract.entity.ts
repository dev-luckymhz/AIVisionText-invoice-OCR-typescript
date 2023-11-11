import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BaseEntity,
} from 'typeorm';

@Entity()
export class Contract extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  employerName: string;

  @Column({ length: 100 })
  employeeName: string;

  @Column('text')
  nationalId: string;

  @Column('date')
  dateOfBirth: Date;

  @Column({ length: 100 })
  jobTitle: string;

  @Column('date')
  startDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  salary: number;
}
