/**
 * @uniflow/shared-types
 * Các hằng số, Kiểu dữ liệu chuẩn Base, Enums và Bộ định nghĩa Brand Theme dùng chung cho Monorepo UniFlow AI.
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
  SURFACE_DARK_600: '#374151',
  BORDER_DARK: '#374151',
  TEXT_DARK_PRIMARY: '#F9FAFB',
  TEXT_DARK_SECONDARY: '#9CA3AF',
  TEXT_DARK_MUTED: '#6B7280',
} as const;

// ============================================================================
// 2. BASE GENERIC & UTILITY TYPES
// ============================================================================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Dictionary<T = any> = Record<string, T>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface BaseEntity {
  _id: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  isDeleted?: boolean;
}

export interface AuditableEntity extends BaseEntity {
  createdBy?: string;
  updatedBy?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: any;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message?: string;
  data: T;
  timestamp?: string;
  path?: string;
}

// ============================================================================
// 3. AUTH & RBAC TYPES
// ============================================================================

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  STORE_ADMIN = 'STORE_ADMIN',
  OPERATOR = 'OPERATOR',
  VIEWER = 'VIEWER',
}

export interface UserProfile extends BaseEntity {
  email: string;
  fullName: string;
  role: UserRole;
  tenantId: string;
  avatarUrl?: string;
  isActive: boolean;
  lastLoginAt?: string | Date;
}

export interface JWTPayload {
  sub: string;
  email: string;
  role: UserRole;
  tenantId: string;
  iat?: number;
  exp?: number;
}

// ============================================================================
// 4. PLATFORM & CONNECTOR ENUMS
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
// 5. ORDER & WORKFLOW STATUS ENUMS
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
// 6. WEBSOCKET REAL-TIME EVENT TYPES
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
  rawLog?: any;
  healingDetails?: {
    originalCarrier?: string;
    fallbackCarrier?: string;
    reason?: string;
  };
}
