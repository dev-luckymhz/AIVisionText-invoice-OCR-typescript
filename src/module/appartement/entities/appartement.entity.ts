import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
} from 'typeorm';
import { Logement } from '../../logement/entities/logement.entity';

@Entity()
export class Apartment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  unitNumber: string; // Unit number or identifier

  @Column({ type: 'int', nullable: false })
  numberOfBedrooms: number; // Number of bedrooms in the unit

  @Column({ type: 'int', nullable: false })
  numberOfBathrooms: number; // Number of bathrooms in the unit

  @Column({ type: 'float', nullable: false })
  squareFootage: number; // Square footage of the unit

  @ManyToOne(() => Logement, (logement) => logement.appartements)
  property: Logement; // Establish a many-to-one relationship with Logement (Property)
}
