import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConnectorsController } from './connectors.controller';
import { ConnectorsService } from './connectors.service';
import { ActionsController } from './actions.controller';
import { ActionsService } from './actions.service';
import { SyncPollerService } from './sync-poller.service';
import { Connector, ConnectorSchema } from '../../database/schemas/connector.schema';
import { SyncEventLog, SyncEventLogSchema } from '../../database/schemas/sync-event-log.schema';
import { WebSocketModule } from '../websocket/websocket.module';
import { DeveloperPortalModule } from '../developer-portal/developer-portal.module';
import { NormalizerModule } from '../normalizer/normalizer.module';
import { SecurityService } from '../../security/security.service';

import { InfraGatewayController } from './infra-gateway.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Connector.name, schema: ConnectorSchema },
      { name: SyncEventLog.name, schema: SyncEventLogSchema },
    ]),
    WebSocketModule,
    DeveloperPortalModule,
    NormalizerModule,
  ],
  controllers: [ConnectorsController, ActionsController, InfraGatewayController],
  providers: [ConnectorsService, ActionsService, SyncPollerService, SecurityService],
  exports: [ConnectorsService, ActionsService, SyncPollerService],
})
export class ConnectorsModule {}
