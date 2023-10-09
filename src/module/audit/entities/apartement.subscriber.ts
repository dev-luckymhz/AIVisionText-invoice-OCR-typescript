import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { AuditEntity } from './Audit.entity';
import { Injectable } from '@nestjs/common';
import { Apartment } from '../../appartement/entities/appartement.entity';

@Injectable()
@EventSubscriber()
export class ApartmentSubscriber
  implements EntitySubscriberInterface<Apartment>
{
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Apartment; // Listen to ApartmentEntity events
  }

  afterInsert(event: InsertEvent<Apartment>) {
    const audit = AuditEntity.createAuditEntity(event, 'insert', 'apartment'); // Create the Audit entity

    audit.recordId = event.entity.id;
    audit.user = event.entity.user;

    // Convert the JSON object to a string
    delete event.entity.user;
    audit.newValue = JSON.stringify(event.entity);
    ApartmentSubscriber.createAuditEntry(audit);
  }

  afterUpdate(event: UpdateEvent<Apartment>) {
    const audit = AuditEntity.createAuditEntity(event, 'update', 'apartment'); // Create the Audit entity

    // Convert the JSON object to a string
    audit.user = event.entity.user;
    audit.recordId = event.entity.id;

    delete event.entity.user;

    const oldValueString = JSON.stringify(event.databaseEntity);
    audit.newValue = JSON.stringify(event.entity);
    audit.oldValue = oldValueString;

    ApartmentSubscriber.createAuditEntry(audit);
  }

  public static async createAuditEntry(audit: any) {
    try {
      await Promise.resolve(audit.save());
    } catch (error) {
      // Handle the exception here
      console.log(error);
    }
  }
}
