import axios, { AxiosInstance } from 'axios';
import { Logger } from '@nestjs/common';

export interface GHNFeeParams {
  service_type_id?: number; // 2 = Standard ecommerce
  to_ward_code: string;
  to_district_id: number;
  weight: number; // gram
  insurance_value?: number;
}

export interface GHNOrderParams {
  to_name: string;
  to_phone: string;
  to_address: string;
  to_ward_name: string;
  to_district_name: string;
  to_province_name: string;
  weight: number;
  length?: number;
  width?: number;
  height?: number;
  cod_amount: number;
  content: string;
  payment_type_id?: 1 | 2; // 1=Shop trả phí; 2=Người nhận trả
  service_type_id?: number;
  required_note?: 'CHOTHUHANG' | 'CHOXEMHANGKHONGTHU' | 'KHONGCHOXEMHANG';
  items?: Array<{ name: string; quantity: number; weight: number }>;
}

/**
 * GHNProvider — Tích hợp Giao Hàng Nhanh API v2
 *
 * Sandbox:    https://dev-online-gateway.ghn.vn/shiip/public-api
 * Production: https://online-gateway.ghn.vn/shiip/public-api
 *
 * Đăng ký: https://api.ghn.vn | email webhook: api@ghn.vn
 */
export class GHNProvider {
  private readonly client: AxiosInstance;
  private readonly logger = new Logger(GHNProvider.name);

  constructor(
    private readonly token: string,
    private readonly shopId: number,
    isSandbox = true,
  ) {
    const baseURL = isSandbox
      ? 'https://dev-online-gateway.ghn.vn/shiip/public-api'
      : 'https://online-gateway.ghn.vn/shiip/public-api';

    this.client = axios.create({
      baseURL,
      timeout: 5000,
      headers: {
        Token: token,
        ShopId: String(shopId),
        'Content-Type': 'application/json',
      },
    });
  }

  /** Tính phí vận chuyển trước khi tạo đơn */
  async calculateFee(params: GHNFeeParams) {
    const res = await this.client.post('/v2/shipping-order/fee', {
      service_type_id: params.service_type_id ?? 2,
      to_ward_code: params.to_ward_code,
      to_district_id: params.to_district_id,
      weight: params.weight,
      insurance_value: params.insurance_value ?? 0,
    });
    // res.data.data = { total, service_fee, insurance_fee, pick_station_fee, coupon_value, ... }
    return res.data?.data as {
      total: number;
      service_fee: number;
      insurance_fee: number;
    };
  }

  /** Tạo vận đơn và nhận mã tracking */
  async createOrder(order: GHNOrderParams) {
    const res = await this.client.post('/v2/shipping-order/create', {
      payment_type_id: 2,
      service_type_id: 2,
      required_note: 'KHONGCHOXEMHANG',
      length: 15,
      width: 15,
      height: 10,
      ...order,
    });
    // res.data.data = { order_code, sort_code, trans_type, ward_encode, fee, expected_delivery_time }
    return res.data?.data as { order_code: string; expected_delivery_time: string };
  }

  /** Hủy đơn (truyền mã vận đơn GHN) */
  async cancelOrder(orderCode: string) {
    const res = await this.client.post('/v2/shipping-order/cancel', {
      order_codes: [orderCode],
    });
    return res.data;
  }

  /** Lấy danh sách tỉnh/thành — dùng để map địa chỉ */
  async getProvinces() {
    const res = await this.client.get('/master-data/province');
    return res.data?.data as Array<{ ProvinceID: number; ProvinceName: string }>;
  }

  /** Lấy quận/huyện theo tỉnh */
  async getDistricts(provinceId: number) {
    const res = await this.client.post('/master-data/district', { province_id: provinceId });
    return res.data?.data as Array<{ DistrictID: number; DistrictName: string }>;
  }

  /** Lấy phường/xã theo quận */
  async getWards(districtId: number) {
    const res = await this.client.post('/master-data/ward', { district_id: districtId });
    return res.data?.data as Array<{ WardCode: string; WardName: string }>;
  }
}

/** Factory: tạo instance từ env vars */
export function createGHNProvider(): GHNProvider | null {
  const token = process.env.GHN_TOKEN;
  const shopId = parseInt(process.env.GHN_SHOP_ID || '0', 10);
  const isSandbox = process.env.GHN_SANDBOX !== 'false';

  if (!token || !shopId) return null;
  return new GHNProvider(token, shopId, isSandbox);
}
