import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BaseEntity,
  ManyToOne, JoinColumn
} from "typeorm";
import { Apartment } from '../../appartement/entities/appartement.entity';
import { User } from '../../users/entities/user.entity';

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

  @OneToMany(() => Apartment, (appartement) => appartement.property)
  appartements: Apartment[]; // Establish a one-to-many relationship with Appartement

  @ManyToOne(() => User, (user) => user.documents, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;
}
