import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Contract {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  employerName: string;

  @Column({ length: 500 })
  employeeName: string;

  @Column('text')
  nationalId: string;

  @Column('date')
  dateOfBirth: Date;

  @Column({ length: 500 })
  jobTitle: string;

  @Column('date')
  startDate: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  salary: number;
}
