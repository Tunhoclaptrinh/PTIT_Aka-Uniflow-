/**
 * UNIFLOW AI — SAPO DEEP CRAWLER: CÀO TOÀN BỘ CÁC THUỘC TÍNH VÀ NGÓC NGÁCH
 * 
 * Cào toàn diện:
 * - cac-thuoc-tinh-cua-order-api
 * - cac-thuoc-tinh-cua-product-api
 * - cac-thuoc-tinh-cua-customer-api
 * - Tất cả các trang phương thức GET/POST/PUT/DELETE
 */

const fs = require('fs');
const path = require('path');

const SAPO_DIR = path.resolve(__dirname, '../../packages/connectors-spec/full-specs/sapo');
if (!fs.existsSync(SAPO_DIR)) fs.mkdirSync(SAPO_DIR, { recursive: true });

async function deepCrawlSapo() {
  console.log('[*] Đang khởi động Sapo Deep Crawler...');

  // Danh sách các trang thuộc tính và chi tiết của Sapo
  const targetSlugs = [
    'cac-thuoc-tinh-cua-order-api',
    'gioi-thieu-order-api',
    'phuong-thuc-get-cua-order-phan-1',
    'phuong-thuc-get-cua-order-phan-2',
    'phuong-thuc-post-cua-order-phan-1',
    'phuong-thuc-post-cua-order-phan-2',
    'phuong-thuc-put-cua-order',
    'phuong-thuc-delete-cua-order',
    'product',
    'product-variant',
    'product-image',
    'phuong-thuc-get-cua-product',
    'phuong-thuc-post-cua-product',
    'phuong-thuc-put-cua-product',
    'phuong-thuc-delete-cua-product',
    'customer',
    'customeraddress',
    'fulfillment',
    'refund',
    'transaction',
    'carrier-service',
    'price-rule',
    'discountcode',
    'sapo-webhook',
    'metafield',
    'smartcollection',
    'customcollection',
    'collect',
    'asset',
    'theme',
    'scripttag',
    'oauth',
  ];

  const fullAttributes = {};

  for (const slug of targetSlugs) {
    const url = `https://support.sapo.vn/${slug}`;
    process.stdout.write(`  -> Đang cào ${slug} ... `);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.log(`[HTTP ${res.status}]`);
        continue;
      }
      const html = await res.text();

      // Bóc tách tiêu đề
      const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      const title = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : slug;

      // Bóc tách các thẻ p, h2, h3, h4 mô tả thuộc tính
      const detailMatch = html.match(/<div class="detail-content">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/i);
      const contentHtml = detailMatch ? detailMatch[1] : html;

      // Trích xuất code blocks
      const codeMatches = contentHtml.match(/<pre[^>]*>([\s\S]*?)<\/pre>/gi) || [];
      const codeSnippets = codeMatches.map(c => c.replace(/<[^>]+>/g, '').trim()).filter(c => c.length > 5);

      // Trích xuất danh sách thuộc tính từ thẻ p hoặc li
      const textMatches = contentHtml.match(/<p>([\s\S]*?)<\/p>/gi) || [];
      const paragraphs = textMatches.map(p => p.replace(/<[^>]+>/g, '').trim()).filter(p => p.length > 10);

      fullAttributes[slug] = {
        title,
        url,
        codeSnippetsCount: codeSnippets.length,
        codeSnippets: codeSnippets,
        descriptions: paragraphs.slice(0, 15),
      };

      console.log(`[Thành công: ${codeSnippets.length} snippets, ${paragraphs.length} mô tả]`);
    } catch (e) {
      console.log(`[Lỗi: ${e.message}]`);
    }
  }

  const outPath = path.join(SAPO_DIR, 'sapo_complete_deep_attributes.json');
  fs.writeFileSync(outPath, JSON.stringify(fullAttributes, null, 2), 'utf8');
  console.log(`\n🎉 [XUẤT SẮC] Đã lưu trọn vẹn toàn bộ ngóc ngách thuộc tính Sapo tại:`);
  console.log(`👉 ${outPath}`);

  // Trích xuất riêng tài liệu Thuộc tính Order sang Markdown dễ đọc
  const orderProps = fullAttributes['cac-thuoc-tinh-cua-order-api'];
  if (orderProps) {
    const mdPath = path.join(SAPO_DIR, 'sapo_order_properties_complete.md');
    let mdContent = `# SAPO API — BẢNG CHI TIẾT TOÀN BỘ CÁC THUỘC TÍNH CỦA ORDER (ĐƠN HÀNG)\n\n`;
    mdContent += `Nguồn: ${orderProps.url}\n\n`;
    mdContent += `## 1. Mô tả tổng quan\n\n`;
    mdContent += orderProps.descriptions.join('\n\n');
    mdContent += `\n\n## 2. Toàn bộ Snippets JSON Thuộc tính\n\n`;
    for (let i = 0; i < orderProps.codeSnippets.length; i++) {
      mdContent += `\`\`\`json\n${orderProps.codeSnippets[i]}\n\`\`\`\n\n`;
    }
    fs.writeFileSync(mdPath, mdContent, 'utf8');
    console.log(`👉 Đã xuất bản Markdown Thuộc tính Order tại: ${mdPath}\n`);
  }
}

deepCrawlSapo();
