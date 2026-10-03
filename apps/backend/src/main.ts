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
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
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

  // Cấu hình Swagger OpenAPI Documentation & Testing Portal
  const config = new DocumentBuilder()
    .setTitle('UniFlow Enterprise — Trung Tâm Điều Khiển Hạ Tầng Phần Mềm Doanh Nghiệp')
    .setDescription(
      'Cổng API Gateway điều khiển toàn bộ hệ sinh thái phần mềm: Sàn TMĐT (Shopee, TikTok Shop, Lazada, Tiki, Shopify), POS & Bán lẻ (Sapo, Nhanh.vn, Pancake, KiotViet, Haravan), Hệ sinh thái MISA (eShop, meInvoice, AMIS CRM, AMIS Kế toán), Đơn vị vận chuyển (GHTK, GHN, Viettel Post), Chăm sóc khách hàng & Cảnh báo (Telegram, Zalo ZNS), Quản lý Voucher & Khuyến mãi, và Động cơ Workflow DAG.',
    )
    .setVersion('2.5.0-Enterprise')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'UniFlow Enterprise API & Infrastructure Portal',
    customCss: `
      .swagger-ui .topbar { background-color: #0f172a; border-bottom: 2px solid #3b82f6; }
      .swagger-ui .info { margin: 20px 0; }
      .swagger-ui .info .title { color: #1e293b; font-family: Inter, sans-serif; font-weight: 800; }
      .swagger-ui .scheme-container { background: #f8fafc; padding: 15px 0; box-shadow: none; }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      docExpansion: 'none',
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`=======================================================`);
  logger.log(`⚡ UniFlow AI Backend API Gateway is RUNNING`);
  logger.log(`🚀 Port: http://localhost:${port}`);
  logger.log(`📑 Swagger UI & Testing Portal: http://localhost:${port}/docs`);
  logger.log(`🧪 Partner Sandbox Gateway: http://localhost:${port}/api/v1/sandbox/:platform`);
  logger.log(`🔌 Inbound Webhooks: http://localhost:${port}/api/v1/webhooks`);
  logger.log(`📡 WebSocket Gateway: ws://localhost:${port}`);
  logger.log(`=======================================================`);
}

bootstrap();
