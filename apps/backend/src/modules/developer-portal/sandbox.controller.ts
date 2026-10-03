import { Controller, All, Req, Res, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { SandboxService } from './sandbox.service';

@Controller('api/v1/sandbox')
export class SandboxController {
  private readonly logger = new Logger(SandboxController.name);

  constructor(private readonly sandboxService: SandboxService) {}

  @All('sapo/*')
  handleSapo(@Req() req: Request, @Res() res: Response) {
    const endpoint = req.url.replace('/api/v1/sandbox/sapo', '');
    const result = this.sandboxService.handleSapoSandbox(endpoint, req.method, req.body);
    const statusCode = req.method === 'POST' && endpoint.includes('orders.json') ? 201 : 200;
    return res.status(statusCode).json(result);
  }

  @All('nhanh/*')
  handleNhanh(@Req() req: Request, @Res() res: Response) {
    const endpoint = req.url.replace('/api/v1/sandbox/nhanh', '');
    const result = this.sandboxService.handleNhanhSandbox(endpoint, req.method, req.body);
    return res.status(200).json(result);
  }

  @All('pancake/*')
  handlePancake(@Req() req: Request, @Res() res: Response) {
    const endpoint = req.url.replace('/api/v1/sandbox/pancake', '');
    const result = this.sandboxService.handlePancakeSandbox(endpoint, req.method, req.body);
    return res.status(200).json(result);
  }

  @All('misa-meinvoice/*')
  handleMisaInvoice(@Req() req: Request, @Res() res: Response) {
    const endpoint = req.url.replace('/api/v1/sandbox/misa-meinvoice', '');
    const result = this.sandboxService.handleMisaInvoiceSandbox(endpoint, req.method, req.body);
    return res.status(200).json(result);
  }

  @All('misa-crm/*')
  handleMisaCrm(@Req() req: Request, @Res() res: Response) {
    const endpoint = req.url.replace('/api/v1/sandbox/misa-crm', '');
    const result = this.sandboxService.handleMisaCrmSandbox(endpoint, req.method, req.body);
    return res.status(200).json(result);
  }

  @All('telegram/*')
  handleTelegram(@Req() req: Request, @Res() res: Response) {
    const endpoint = req.url.replace('/api/v1/sandbox/telegram', '');
    const result = this.sandboxService.handleTelegramSandbox(endpoint, req.method, req.body);
    return res.status(200).json(result);
  }

  @All('shopee/*')
  handleShopee(@Req() req: Request, @Res() res: Response) {
    return res.status(200).json({
      order_sn: req.query.order_sn_list || '241003VNSHOPEE01',
      order_status: 'READY_TO_SHIP',
      total_amount: 500000,
      recipient_address: {
        name: 'Tuấn Nguyễn',
        phone: '0987654321',
        full_address: 'Tòa Discovery Complex, 302 Cầu Giấy, Hà Nội',
      },
    });
  }

  @All('tiktok/*')
  handleTikTok(@Req() req: Request, @Res() res: Response) {
    return res.status(200).json({
      order_id: '5769210293847561',
      order_status: 'AWAITING_SHIPMENT',
      payment_method: 'CASH_ON_DELIVERY',
      total_amount: 500000,
      currency: 'VND',
    });
  }
}
