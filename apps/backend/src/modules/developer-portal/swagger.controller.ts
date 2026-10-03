import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { SandboxService } from './sandbox.service';

@Controller()
export class SwaggerController {
  constructor(private readonly sandboxService: SandboxService) {}

  @Get('api-docs/specs')
  getSpecsList() {
    return this.sandboxService.getAllSpecsSummary();
  }

  @Get('api-docs/specs/:specName')
  getSpecJson(@Param('specName') specName: string, @Res() res: Response) {
    const cleanName = specName.replace('.json', '');
    const spec = this.sandboxService.getSpec(cleanName);
    if (!spec) {
      throw new NotFoundException(`Specification '${cleanName}' not found`);
    }
    return res.status(200).json(spec);
  }

  @Get(['docs', 'api-docs'])
  renderSwaggerUi(@Res() res: Response) {
    const specs = this.sandboxService.getAllSpecsSummary();
    const urlsConfig = JSON.stringify(specs.map(s => ({ url: s.url, name: s.name })));

    const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>UniFlow AI — Interactive API Testing & Connector Specifications Portal</title>
  <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css" />
  <link rel="icon" type="image/png" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/favicon-32x32.png" sizes="32x32" />
  <style>
    html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
    *, *:before, *:after { box-sizing: inherit; }
    body { margin: 0; background: #fafafa; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    .uniflow-header {
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      color: #fff;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #3b82f6;
    }
    .uniflow-title {
      font-size: 20px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .uniflow-badge {
      background: #3b82f6;
      color: white;
      font-size: 11px;
      padding: 4px 8px;
      border-radius: 9999px;
      font-weight: 600;
    }
    .uniflow-desc {
      font-size: 13px;
      color: #94a3b8;
    }
    .swagger-ui .topbar { display: block; background-color: #1e293b; padding: 10px 0; }
    .swagger-ui .topbar select {
      font-weight: 600;
      border: 2px solid #3b82f6;
      border-radius: 6px;
      padding: 6px 12px;
      background: #ffffff;
      color: #0f172a;
    }
  </style>
</head>
<body>
  <div class="uniflow-header">
    <div>
      <div class="uniflow-title">
        <span>⚡ UniFlow AI Hub</span>
        <span class="uniflow-badge">API Spec & Mock Portal</span>
      </div>
      <div class="uniflow-desc">Cổng thử nghiệm tương tác API, kiểm thử đa nền tảng và đối soát cấu trúc dữ liệu UDM dành cho Lập trình viên & Tester</div>
    </div>
  </div>
  <div id="swagger-ui"></div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.min.js"></script>
  <script>
    window.onload = function() {
      const urls = ${urlsConfig};
      window.ui = SwaggerUIBundle({
        urls: urls,
        "urls.primaryName": "Sapo Omnichannel POS & Retail",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout",
        defaultModelsExpandDepth: 4,
        defaultModelExpandDepth: 4,
        displayRequestDuration: true,
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
        tryItOutEnabled: true
      });
    };
  </script>
</body>
</html>`;

    return res.status(200).header('Content-Type', 'text/html; charset=utf-8').send(html);
  }
}
