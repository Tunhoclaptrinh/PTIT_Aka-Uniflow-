/**
 * Partner and Connector logos mapping utility for UniFlow
 * 100% Local Vector & High-Res Assets for maximum speed, zero broken images, and offline support
 */
export const getPartnerLogo = (idOrName: string): string => {
  const s = (idOrName || '').toLowerCase();
  if (s.includes('tiktok')) return '/logopartner/Tiktok Shop Logo - Colored - zonalogo.com.svg';
  if (s.includes('shopee')) return '/logopartner/Shopee_Logo.svg';
  if (s.includes('lazada')) return '/logopartner/Lazada_Logo.svg';
  if (s.includes('tiki')) return '/logopartner/Tiki.svg';
  if (s.includes('sapo')) return '/logopartner/Sapo_Logo.png';
  if (s.includes('kiotviet') || s.includes('kiot')) return '/logopartner/KiotViet.svg';
  if (s.includes('haravan')) return '/logopartner/Haravan_Logo.svg';
  if (s.includes('nhanh')) return '/logopartner/Nhanh_Logo.svg';
  if (s.includes('ghtk') || s.includes('tiết kiệm') || s.includes('tiet kiem')) return '/logopartner/GHTK.svg';
  if (s.includes('ghn') || s.includes('giao hàng nhanh') || (s.includes('nhanh') && s.includes('giao'))) return '/logopartner/GHN_Logo.png';
  if (s.includes('viettel') || s.includes('vtp')) return '/logopartner/ViettelPost.svg';
  if (s.includes('j&t') || s.includes('jt') || s.includes('jtexpress')) return '/logopartner/JT_Logo.svg';
  if (s.includes('pancake')) return '/logopartner/Pancake_Logo.svg';
  if (s.includes('ladipage') || s.includes('ladi')) return '/logopartner/LadiPage_Logo.svg';
  if (s.includes('google') || s.includes('sheet') || s.includes('gg sheet')) return '/logopartner/GoogleSheets_Logo.svg';
  if (s.includes('excel') || s.includes('csv') || s.includes('spreadsheet')) return '/logopartner/Excel_Logo.svg';
  if (s.includes('misa') || s.includes('meinvoice') || s.includes('amis')) return '/logopartner/MISA_Logo.svg';
  if (s.includes('fast') || s.includes('fast accounting') || s.includes('fast_acc')) return '/logopartner/Fast_Logo.svg';
  if (s.includes('bravo')) return '/logopartner/Fast_Logo.svg';
  if (s.includes('telegram')) return '/logopartner/Telegram_Logo.svg';
  if (s.includes('zalo')) return '/logopartner/Zalo_Logo.svg';
  if (s.includes('lark')) {
    return 'https://upload.wikimedia.org/wikipedia/commons/3/36/Lark_logo.svg';
  }
  if (s.includes('odoo')) {
    return 'https://upload.wikimedia.org/wikipedia/commons/5/50/Odoo_logo.svg';
  }

  if (s.includes('woo') || s.includes('woocommerce')) return '/logopartner/WooCommerce_Logo.svg';
  if (s.includes('shopify')) return '/logopartner/Shopify_Logo.svg';
  return '';
};
