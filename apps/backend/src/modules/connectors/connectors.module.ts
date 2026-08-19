import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConnectorsController } from './connectors.controller';
import { ConnectorsService } from './connectors.service';
import { Connector, ConnectorSchema } from '../../database/schemas/connector.schema';
import { SyncEventLog, SyncEventLogSchema } from '../../database/schemas/sync-event-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Connector.name, schema: ConnectorSchema },
      { name: SyncEventLog.name, schema: SyncEventLogSchema },
    ]),
  ],
  controllers: [ConnectorsController],
  providers: [ConnectorsService],
  exports: [ConnectorsService],
})
export class ConnectorsModule {}
