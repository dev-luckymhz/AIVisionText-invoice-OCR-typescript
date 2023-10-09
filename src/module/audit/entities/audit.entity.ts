import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('audit')
export class AuditEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tableName: string; // the name of the table being audited

  @Column()
  recordId: number; // the ID of the record in the audited table

  @Column()
  action: string; // the action performed (e.g., 'insert', 'update', 'delete')

  @Column({ type: 'json', nullable: true })
  oldValue: any; // the old values of the record

  @Column({ type: 'json', nullable: true })
  newValue: any; // the new values of the record

  @Column()
  timestamp: Date; // the timestamp of the change

  @ManyToOne(() => User, {})
  user: User; // the user who made the change

  // Function to create an Audit entity and return it
  public static createAuditEntity(
    event: any,
    action: string,
    tName = 'logement',
  ): AuditEntity {
    // console.log(event.entity)
    const audit = new AuditEntity();
    audit.tableName = tName;
    audit.action = action;
    audit.timestamp = new Date();
    return audit;
  }
}
