/**
 * Vietnam Logistics Modular Architecture Re-export Barrel & Compatibility Layer
 * All 6 Logistics modules are implemented under ./logistics/
 * - 01. Giao Hàng Tiết Kiệm (GHTK)
 * - 02. Giao Hàng Nhanh (GHN)
 * - 03. Viettel Post (VTP)
 * - 04. Vietnam Post (VNPost & EMS)
 * - 05. J&T Express & Ninja Van
 * - 06. Instant & On-Demand Delivery (Ahamove & GrabExpress)
 */
export * from './ghtk.controller';
export * from './ghn.controller';
export * from './viettel-post.controller';
export * from './vnpost.controller';
export * from './jt-ninjavan.controller';
export * from './ondemand-logistics.controller';
