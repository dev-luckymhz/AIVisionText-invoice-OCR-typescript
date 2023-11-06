import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Invoice } from '../../entities/invoice.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @Column('int')
  qty: number;

  @ManyToOne(() => Invoice, (invoice) => invoice.products)
  invoice: Invoice;
}
