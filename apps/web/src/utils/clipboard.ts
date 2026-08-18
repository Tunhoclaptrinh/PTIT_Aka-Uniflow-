import { notify } from './notification';

/**
 * Tiện ích sao chép văn bản vào Clipboard chuẩn base
 */
export async function copyToClipboard(text: string, successMessage = 'Đã sao chép vào clipboard!'): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      notify.success(successMessage);
      return true;
    }

    // Fallback cho trình duyệt cũ
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);

    if (successful) {
      notify.success(successMessage);
      return true;
    }
    throw new Error('Lệnh copy thất bại');
  } catch (err) {
    notify.error('Không thể sao chép văn bản, vui lòng thử lại!');
    return false;
  }
}
