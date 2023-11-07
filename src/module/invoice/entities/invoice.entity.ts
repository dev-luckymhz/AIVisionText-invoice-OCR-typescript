import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Product } from '../product/entities/product.entity';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerName: string;

  @Column()
  address: string;

  @Column()
  contactNo: number;

  @Column()
  email: string;

  @Column({ nullable: true })
  additionalDetails: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Product, (product) => product.invoice, { cascade: true })
  products: Product[];
}
