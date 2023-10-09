import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { AuditEntity } from './Audit.entity';
import { Injectable } from '@nestjs/common';
import { Logement } from '../../logement/entities/logement.entity';

@Injectable()
@EventSubscriber()
export class LogementSubscriber implements EntitySubscriberInterface<Logement> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Logement; // Listen to LogementEntity events
  }

  afterInsert(event: InsertEvent<Logement>) {
    const audit = AuditEntity.createAuditEntity(event, 'insert', 'logement'); // Create the Audit entity

    audit.recordId = event.entity.id;
    audit.user = event.entity.user;

    // Convert the JSON object to a string
    delete event.entity.user;
    audit.newValue = JSON.stringify(event.entity);
    LogementSubscriber.createAuditEntry(audit);
  }

  afterUpdate(event: UpdateEvent<Logement>) {
    const audit = AuditEntity.createAuditEntity(event, 'update', 'logement'); // Create the Audit entity

    // Convert the JSON object to a string
    audit.recordId = event.entity.id;
    audit.user = event.entity.user;

    delete event.entity.user;

    const oldValueString = JSON.stringify(event.databaseEntity);
    audit.newValue = JSON.stringify(event.entity);
    audit.oldValue = oldValueString;

    LogementSubscriber.createAuditEntry(audit);
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
