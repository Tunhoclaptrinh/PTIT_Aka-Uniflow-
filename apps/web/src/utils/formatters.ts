/**
 * Bộ công cụ định dạng chuẩn Base cho Frontend UniFlow AI
 */

/**
 * Định dạng số nguyên / thập phân có phân tách hàng nghìn (Ví dụ: 12,345 hoặc 12.345)
 */
export function formatNumber(value: number | string | undefined | null, defaultValue = '0'): string {
  if (value === undefined || value === null || value === '') return defaultValue;
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return defaultValue;
  return new Intl.NumberFormat('vi-VN').format(num);
}

/**
 * Định dạng tiền tệ VNĐ (Ví dụ: 185.000 đ hoặc 21.5 Tr VNĐ)
 */
export function formatVND(amount: number, compact = false): string {
  if (compact && Math.abs(amount) >= 1000000) {
    return `${(amount / 1000000).toFixed(1)} Tr VNĐ`;
  }
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

/**
 * Định dạng thời gian tương đối (Ví dụ: "2 phút trước", "Vừa xong")
 */
export function formatTimeAgo(dateInput: string | Date | number): string {
  const date = new Date(dateInput);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 30) return 'Vừa xong';
  if (diffInSeconds < 60) return `${diffInSeconds} giây trước`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ trước`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} ngày trước`;
}

/**
 * Định dạng ngày giờ chuẩn Việt Nam (HH:mm:ss DD/MM/YYYY)
 */
export function formatDateTime(dateInput: string | Date | number): string {
  const date = new Date(dateInput);
  return date.toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Định dạng độ trễ API (Ví dụ: "180ms" hoặc "1.2s")
 */
export function formatLatency(ms: number): string {
  if (ms >= 1000) {
    return `${(ms / 1000).toFixed(2)}s`;
  }
  return `${Math.round(ms)}ms`;
}

/**
 * Rút gọn chuỗi có dấu ba chấm
 */
export function truncateText(text: string, maxLength = 30): string {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}
