// Import necessary modules and decorators from TypeORM
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  BeforeInsert,
  ManyToOne,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserRole } from './user-role.entity';

// Import any other related entities or decorators here

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // Note: Password should be hashed and stored securely

  @ManyToOne(() => UserRole, (role) => role.users)
  role: UserRole; // Define the relationship with UserRole

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Define relationships with other entities here

  // @OneToMany(() => Document, (document) => document.user)
  // documents: Document[];

  // @OneToMany(() => Notification, (notification) => notification.user)
  // notifications: Notification[];

  // Add a BeforeInsert hook to hash the password before insertion
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10); // Hash the password with a salt factor of 10
  }
}
