import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('UniFlowBootstrap');
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  // Bật CORS cho Frontend
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`=======================================================`);
  logger.log(`⚡ UniFlow AI Backend API Gateway is RUNNING`);
  logger.log(`🚀 Port: http://localhost:${port}`);
  logger.log(`🔌 Inbound Webhooks: http://localhost:${port}/api/v1/webhooks`);
  logger.log(`📡 WebSocket Gateway: ws://localhost:${port}`);
  logger.log(`=======================================================`);
}

bootstrap();
