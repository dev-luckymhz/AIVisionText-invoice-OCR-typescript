import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BaseEntity,
} from 'typeorm';
import { Appartement } from '../../appartement/entities/appartement.entity';

@Entity()
export class Logement extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  type: string; // Property type (Apartment, House, Condo, etc.)

  @Column({ type: 'text', nullable: false })
  address: string; // Address of the property

  @Column({ type: 'int', nullable: false })
  numberOfUnits: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  owner: string; // Property owner or manager

  @Column({ type: 'varchar', length: 255, nullable: true })
  amenities: string; // Amenities provided (Swimming Pool, Gym, Parking, etc.)

  @Column({ type: 'varchar', length: 255, nullable: true })
  maintenanceContact: string; // Contact information for property maintenance

  @OneToMany(() => Appartement, (appartement) => appartement.property)
  appartements: Appartement[]; // Establish a one-to-many relationship with Appartement
}
