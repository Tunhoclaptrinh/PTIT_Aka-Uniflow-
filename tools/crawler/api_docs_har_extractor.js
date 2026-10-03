/**
 * UNIFLOW AI — API DOCS CRAWLER & HAR EXTRACTOR
 * 
 * Bộ công cụ hỗ trợ Lead Integrator (Tuấn) cào và trích xuất cấu trúc API từ:
 * 1. File HAR (Network capture từ Chrome DevTools khi login tài khoản test)
 * 2. Cổng tài liệu OpenAPI / Swagger ngầm của các nền tảng (KiotViet, GHN, Shopee, TikTok)
 * 3. Chuyển đổi trực tiếp sang chuẩn UniFlow Connector Spec (OpenAPI 3.1 + UDM Mapping)
 * 
 * Hướng dẫn sử dụng:
 * - Trích xuất từ file HAR: node tools/crawler/api_docs_har_extractor.js parse-har <path-to-file.har> <platform-name>
 * - Quét endpoint Swagger/OpenAPI ngầm: node tools/crawler/api_docs_har_extractor.js probe-portal <portal-url>
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const COMMAND = process.argv[2];
const ARG1 = process.argv[3];
const ARG2 = process.argv[4];

const OUTPUT_DIR = path.resolve(__dirname, '../../packages/connectors-spec/schemas');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function printHelp() {
  console.log(`
====================================================================
  UNIFLOW AI — BỘ CÔNG CỤ TRÍCH XUẤT VÀ CHUẨN HÓA API DOCS
====================================================================
Lệnh khả dụng:
  1. Trích xuất API từ Network HAR (Thao tác trên Chrome DevTools):
     node tools/crawler/api_docs_har_extractor.js parse-har ./traffic.har shopee

  2. Quét & tải OpenAPI/Swagger Spec từ cổng Developer:
     node tools/crawler/api_docs_har_extractor.js probe-portal https://developer.kiotviet.net

  3. Sinh Mock Data từ Schema UDM:
     node tools/crawler/api_docs_har_extractor.js generate-mock tiktok
====================================================================
`);
}

/**
 * 1. Bóc tách file HAR thành cấu trúc Endpoint & Payload sạch
 */
function parseHarFile(harFilePath, platformName = 'generic') {
  if (!fs.existsSync(harFilePath)) {
    console.error(`[ERROR] Không tìm thấy file HAR tại: ${harFilePath}`);
    process.exit(1);
  }

  console.log(`[*] Đang đọc và phân tích file HAR: ${harFilePath}...`);
  const rawData = fs.readFileSync(harFilePath, 'utf8');
  const har = JSON.parse(rawData);
  const entries = har.log?.entries || [];

  console.log(`[*] Tổng số request ghi nhận trong HAR: ${entries.length}`);

  const endpoints = [];

  for (const entry of entries) {
    const req = entry.request;
    const res = entry.response;
    const url = new URL(req.url);

    // Bỏ qua static assets (css, js, png, svg, fonts)
    if (url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|woff|woff2|ico|ttf)$/i)) {
      continue;
    }

    // Chỉ lấy API (Content-Type JSON hoặc url có api / v1 / v2 / rest)
    const isApi = (res.content?.mimeType || '').includes('json') || 
                  url.pathname.includes('/api/') || 
                  url.pathname.includes('/rest/') || 
                  url.pathname.includes('/v1/') || 
                  url.pathname.includes('/v2/');

    if (!isApi) continue;

    let reqBody = null;
    let resBody = null;

    if (req.postData?.text) {
      try {
        reqBody = JSON.parse(req.postData.text);
      } catch (e) {
        reqBody = req.postData.text;
      }
    }

    if (res.content?.text) {
      try {
        resBody = JSON.parse(res.content.text);
      } catch (e) {
        resBody = '[Non-JSON Response]';
      }
    }

    endpoints.push({
      method: req.method,
      host: url.host,
      pathname: url.pathname,
      query: Object.fromEntries(new URLSearchParams(url.search)),
      headers: req.headers.filter(h => !h.name.startsWith(':') && !['cookie', 'authorization'].includes(h.name.toLowerCase())),
      requestBodySample: reqBody,
      responseStatus: res.status,
      responseBodySample: resBody,
    });
  }

  console.log(`[+] Lọc thành công ${endpoints.length} API endpoints có giá trị.`);

  // Chuyển hóa sang định dạng OpenAPI 3.1 rút gọn
  const openApiDoc = {
    openapi: '3.1.0',
    info: {
      title: `Trích xuất Reverse API — ${platformName.toUpperCase()}`,
      version: '1.0.0',
      description: `Sinh tự động từ Chrome Network HAR bởi UniFlow Har Extractor lúc ${new Date().toISOString()}`,
    },
    'x-uniflow-platform': {
      code: platformName.toUpperCase(),
      extractedFrom: 'HAR_BROWSER_RECORDING',
    },
    paths: {},
  };

  for (const ep of endpoints) {
    if (!openApiDoc.paths[ep.pathname]) {
      openApiDoc.paths[ep.pathname] = {};
    }

    openApiDoc.paths[ep.pathname][ep.method.toLowerCase()] = {
      summary: `API ${ep.pathname} (${ep.method})`,
      operationId: `${platformName}_${ep.pathname.replace(/[^a-zA-Z0-9]/g, '_')}_${ep.method.toLowerCase()}`,
      parameters: Object.keys(ep.query).map(q => ({
        name: q,
        in: 'query',
        schema: { type: typeof ep.query[q] },
        example: ep.query[q],
      })),
      requestBody: ep.requestBodySample ? {
        content: {
          'application/json': {
            example: ep.requestBodySample,
          },
        },
      } : undefined,
      responses: {
        [ep.responseStatus]: {
          description: `Trạng thái phản hồi thực tế từ sàn (${ep.responseStatus})`,
          content: {
            'application/json': {
              example: ep.responseBodySample,
            },
          },
        },
      },
    };
  }

  const outputPath = path.join(OUTPUT_DIR, `${platformName.toLowerCase()}_extracted_spec.json`);
  fs.writeFileSync(outputPath, JSON.stringify(openApiDoc, null, 2), 'utf8');
  console.log(`\n🎉 [XUẤT SẮC] Đã tạo file OpenAPI Spec chuẩn hóa tại:`);
  console.log(`👉 ${outputPath}\n`);
}

/**
 * 2. Quét Swagger/OpenAPI ngầm từ cổng Developer
 */
async function probePortal(portalUrl) {
  console.log(`[*] Đang thăm dò cổng tài liệu: ${portalUrl}...`);
  const knownSwaggerPaths = [
    '/swagger.json',
    '/api-docs',
    '/v2/api-docs',
    '/openapi.json',
    '/v3/api-docs',
    '/docs/openapi.json',
    '/api/v1/swagger.json',
  ];

  for (const p of knownSwaggerPaths) {
    const target = new URL(p, portalUrl).toString();
    process.stdout.write(`  - Thử đường dẫn ${target} ... `);
    try {
      const res = await fetch(target, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
      if (res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('json')) {
          console.log(`[TÌM THẤY! HTTP 200 JSON]`);
          const data = await res.json();
          const filename = `probed_${new URL(portalUrl).hostname.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
          const savePath = path.join(OUTPUT_DIR, filename);
          fs.writeFileSync(savePath, JSON.stringify(data, null, 2), 'utf8');
          console.log(`\n🎉 Đã lưu thành công Swagger Spec tại: ${savePath}\n`);
          return;
        }
      }
      console.log(`[HTTP ${res.status}]`);
    } catch (e) {
      console.log(`[Lỗi: ${e.message}]`);
    }
  }

  console.log(`\n[!] Không tìm thấy Swagger JSON công khai trực tiếp. Khuyến nghị Tuấn sử dụng lệnh:`);
  console.log(`    node tools/crawler/api_docs_har_extractor.js parse-har <traffic.har> <tên_sàn>\n`);
}

// Điều phối lệnh CLI
switch (COMMAND) {
  case 'parse-har':
    if (!ARG1) {
      console.error('[ERROR] Vui lòng truyền đường dẫn file .har');
      printHelp();
      process.exit(1);
    }
    parseHarFile(path.resolve(process.cwd(), ARG1), ARG2 || 'custom_platform');
    break;
  case 'probe-portal':
    if (!ARG1) {
      console.error('[ERROR] Vui lòng truyền URL cổng developer');
      printHelp();
      process.exit(1);
    }
    probePortal(ARG1);
    break;
  default:
    printHelp();
    break;
}
