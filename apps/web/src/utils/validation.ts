/**
 * Bộ quy tắc kiểm tra tính hợp lệ (Validation Rules) chuẩn base
 */

export const validationRules = {
  required: (message = 'Trường này là bắt buộc!') => ({
    required: true,
    message,
  }),

  email: (message = 'Email không hợp lệ!') => ({
    type: 'email' as const,
    message,
  }),

  phoneVN: (message = 'Số điện thoại không đúng định dạng Việt Nam (10 số)!') => ({
    pattern: /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-4|6-9])[0-9]{7}$/,
    message,
  }),

  skuCode: (message = 'Mã SKU chỉ được chứa chữ hoa, số và dấu gạch nối (Ví dụ: AT-COT-BLK-L)!') => ({
    pattern: /^[A-Z0-9_-]+$/,
    message,
  }),

  url: (message = 'Địa chỉ URL không hợp lệ!') => ({
    type: 'url' as const,
    message,
  }),

  min: (minVal: number, message?: string) => ({
    min: minVal,
    message: message || `Tối thiểu ${minVal} ký tự!`,
  }),

  max: (maxVal: number, message?: string) => ({
    max: maxVal,
    message: message || `Tối đa ${maxVal} ký tự!`,
  }),
};
