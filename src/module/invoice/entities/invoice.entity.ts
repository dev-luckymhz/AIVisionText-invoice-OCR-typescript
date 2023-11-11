import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  BaseEntity,
} from 'typeorm';
import { Product } from '../product/entities/product.entity';

@Entity()
export class Invoice extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerName: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  InvNo: string;

  @Column()
  contactNo: number;

  @Column()
  email: string;

  @Column({ nullable: true })
  additionalDetails: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'int', default: 0 })
  productCount: number;

  @OneToMany(() => Product, (product) => product.invoice, { cascade: true })
  products: Product[];
}
