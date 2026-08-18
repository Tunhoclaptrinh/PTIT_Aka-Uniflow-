/**
 * @uniflow/shared-types
 * Các hằng số, Kiểu dữ liệu, Enums và Bộ định nghĩa Brand Theme dùng chung cho toàn bộ dự án UniFlow AI.
 */

// ============================================================================
// 1. BRAND COLORS & DESIGN SYSTEM CONSTANTS
// ============================================================================

export const BRAND_COLORS = {
  /** Màu Đỏ Aka PTIT chủ đạo (#ed1c24) */
  PRIMARY_AKA_RED: '#ed1c24',
  /** Màu Đỏ Cam tương phản / hover (#d6141b) */
  PRIMARY_DARK: '#d6141b',
  /** Màu Vàng Ánh Kim Solar Gold (#fcc20f) */
  SECONDARY_SOLAR_GOLD: '#fcc20f',
  /** Màu Vàng Gold trầm / viền (#e5ad08) */
  SECONDARY_DARK: '#e5ad08',
  
  /** Gradient Thương hiệu đặc trưng (Aka Red -> Solar Gold) */
  BRAND_GRADIENT: 'linear-gradient(135deg, #ed1c24 0%, #fcc20f 100%)',
  BRAND_GRADIENT_HOVER: 'linear-gradient(135deg, #d6141b 0%, #e5ad08 100%)',

  /** Glow hiệu ứng phát sáng trạng thái Live / Active */
  GLOW_AKA_RED: 'rgba(237, 28, 36, 0.35)',
  GLOW_SOLAR_GOLD: 'rgba(252, 194, 15, 0.35)',

  /** AI & Magic Accent (Tím Neon trí tuệ nhân tạo) */
  ACCENT_AI_PURPLE: '#8B5CF6',
  
  /** Status Colors */
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  DANGER: '#EF4444',
  INFO: '#3B82F6',

  /** Dark Mode Neutrals */
  BG_DARK_900: '#0B0F19',
  SURFACE_DARK_800: '#111827',
  SURFACE_DARK_700: '#1F2937',
  BORDER_DARK: '#374151',
  TEXT_DARK_PRIMARY: '#F9FAFB',
  TEXT_DARK_SECONDARY: '#9CA3AF',
} as const;

// ============================================================================
// 2. PLATFORM & CONNECTOR ENUMS
// ============================================================================

export enum PlatformType {
  // Sàn Thương mại điện tử (Inbound Marketplaces)
  TIKTOK_SHOP = 'TIKTOK_SHOP',
  SHOPEE = 'SHOPEE',
  LAZADA = 'LAZADA',

  // Phần mềm Quản lý Kho / Bán hàng (POS / ERP)
  SAPO = 'SAPO',
  KIOTVIET = 'KIOTVIET',
  HARAVAN = 'HARAVAN',

  // Đơn vị Vận chuyển (Logistics Carriers)
  GHN = 'GHN',
  GHTK = 'GHTK',
  VIETTEL_POST = 'VIETTEL_POST',
}

export enum PlatformCategory {
  MARKETPLACE = 'MARKETPLACE',
  POS_ERP = 'POS_ERP',
  LOGISTICS = 'LOGISTICS',
}

// ============================================================================
// 3. ORDER & WORKFLOW STATUS ENUMS
// ============================================================================

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
}

export enum WebhookProcessingStatus {
  RECEIVED = 'RECEIVED',
  NORMALIZED = 'NORMALIZED',
  ROUTED = 'ROUTED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  DUPLICATE_IGNORED = 'DUPLICATE_IGNORED',
  AUTO_HEALED = 'AUTO_HEALED',
}

export enum SKUMappingConfidence {
  AUTO_APPROVED = 'AUTO_APPROVED',   // >= 0.95 (Tự động duyệt)
  NEEDS_REVIEW = 'NEEDS_REVIEW',     // 0.70 - 0.94 (Gợi ý 1-click)
  MANUAL_REQUIRED = 'MANUAL_REQUIRED'// < 0.70 (Yêu cầu ghép thủ công)
}

export enum WorkflowNodeType {
  TRIGGER = 'TRIGGER',
  ACTION = 'ACTION',
  AI_AGENT = 'AI_AGENT',
  CONDITION = 'CONDITION',
}

// ============================================================================
// 4. WEBSOCKET REAL-TIME EVENT TYPES
// ============================================================================

export enum WSEventType {
  ORDER_SYNCED = 'order:synced',
  ORDER_HEALED = 'order:healed',
  ORDER_FAILED = 'order:failed',
  SKU_MAPPED = 'sku:mapped',
  METRICS_UPDATED = 'metrics:updated',
  LOG_EMITTED = 'log:emitted',
}

export interface LiveFeedItem {
  id: string;
  timestamp: string;
  tenantId: string;
  platform: PlatformType;
  sourceOrderId: string;
  status: WebhookProcessingStatus;
  durationMs: number;
  message: string;
  aiHealed?: boolean;
  healingDetails?: {
    originalCarrier?: string;
    fallbackCarrier?: string;
    reason?: string;
  };
}
