/**
 * Partner logos mapping utility for UniFlow
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
  if (s.includes('ghtk') || s.includes('tiết kiệm') || s.includes('tiet kiem')) return '/logopartner/GHTK.svg';
  if (s.includes('ghn') || s.includes('nhanh') || s.includes('giao hàng nhanh')) return '/logopartner/GHN_Logo.png';
  if (s.includes('viettel') || s.includes('vtp')) return '/logopartner/ViettelPost.svg';
  return '';
};
