/**
 * Partner and Connector logos mapping utility for UniFlow
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
  if (s.includes('nhanh')) return 'https://nhanh.vn/favicon.ico';
  if (s.includes('ghtk') || s.includes('tiết kiệm') || s.includes('tiet kiem')) return '/logopartner/GHTK.svg';
  if (s.includes('ghn') || s.includes('giao hàng nhanh') || (s.includes('nhanh') && s.includes('giao'))) return '/logopartner/GHN_Logo.png';
  if (s.includes('viettel') || s.includes('vtp')) return '/logopartner/ViettelPost.svg';
  if (s.includes('j&t') || s.includes('jt')) return 'https://jtexpress.vn/themes/jtexpress/assets/images/logo.png';
  if (s.includes('pancake')) {
    return 'https://pancake.vn/favicon.ico';
  }
  if (s.includes('ladipage') || s.includes('ladi')) {
    return 'https://ladipage.vn/favicon.ico';
  }
  if (s.includes('google') || s.includes('sheet') || s.includes('gg sheet')) {
    return 'https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg';
  }
  if (s.includes('excel') || s.includes('csv') || s.includes('spreadsheet')) {
    return 'https://upload.wikimedia.org/wikipedia/commons/7/73/Microsoft_Excel_2013-2019_logo.svg';
  }
  if (s.includes('misa') || s.includes('meinvoice') || s.includes('amis')) {
    return 'https://www.misa.vn/wp-content/uploads/2021/04/logo-misa.svg';
  }
  if (s.includes('fast') || s.includes('fast accounting')) {
    return 'https://fast.com.vn/wp-content/uploads/2022/03/logo-fast.png';
  }
  if (s.includes('bravo')) {
    return 'https://www.bravo.com.vn/wp-content/uploads/2021/07/logo.png';
  }
  if (s.includes('telegram')) {
    return 'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg';
  }
  if (s.includes('zalo')) {
    return 'https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg';
  }
  if (s.includes('slack')) {
    return 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg';
  }
  if (s.includes('lark')) {
    return 'https://upload.wikimedia.org/wikipedia/commons/3/36/Lark_logo.svg';
  }
  if (s.includes('odoo')) {
    return 'https://upload.wikimedia.org/wikipedia/commons/5/50/Odoo_logo.svg';
  }
  if (s.includes('woo') || s.includes('woocommerce')) {
    return 'https://upload.wikimedia.org/wikipedia/commons/2/2a/WooCommerce_logo.svg';
  }
  return '';
};
