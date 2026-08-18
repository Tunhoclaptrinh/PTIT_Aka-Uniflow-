import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { LiveFeedItem, WSEventType } from '@uniflow/shared-types';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventsGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client kết nối WebSocket: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client ngắt kết nối WebSocket: ${client.id}`);
  }

  /**
   * Đẩy sự kiện live event pulse tới tất cả dashboard clients đang lắng nghe
   */
  emitLiveFeed(item: LiveFeedItem) {
    if (this.server) {
      this.server.emit(WSEventType.LOG_EMITTED, item);
      this.server.emit(WSEventType.ORDER_SYNCED, item);
    }
  }
}
