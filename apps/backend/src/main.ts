import * as dns from 'dns';

// Khắc phục lỗi querySrv ECONNREFUSED của DNS cục bộ khi resolve MongoDB Atlas SRV
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch {
  // ignore
}

import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { RolesGuard } from './common/guards/roles.guard';

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

  app.getHttpAdapter().get('/', (_req, res) => {
    res.status(200).json({ status: 'ok', service: 'uniflow-backend' });
  });

  // Đăng ký Global Base Filters, Interceptors & Guards
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor(), new TransformInterceptor());
  app.useGlobalGuards(new RolesGuard(new Reflector()));

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
