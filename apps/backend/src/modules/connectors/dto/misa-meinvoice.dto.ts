import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

// ── 1. meInvoice - INVOICE LINE ITEM DTO ──
export class MisaInvoiceDetailLineDto {
  @ApiProperty({ example: 1, description: 'Số thứ tự dòng' })
  @IsNumber()
  lineNumber: number;

  @ApiProperty({ example: 'SP-SERVER-01', description: 'Mã hàng hóa / dịch vụ' })
  @IsString()
  itemCode: string;

  @ApiProperty({ example: 'Dịch vụ Thuê Máy Chủ Đám Mây Cloud Server Standard (Gói 12 tháng)', description: 'Tên hàng hóa / dịch vụ' })
  @IsString()
  itemName: string;

  @ApiProperty({ example: 'Gói', description: 'Đơn vị tính' })
  @IsString()
  unit: string;

  @ApiProperty({ example: 1, description: 'Số lượng' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 12000000, description: 'Đơn giá trước thuế GTGT (VND)' })
  @IsNumber()
  unitPrice: number;

  @ApiProperty({ example: 12000000, description: 'Thành tiền trước thuế (VND)' })
  @IsNumber()
  amountWithoutVAT: number;

  @ApiProperty({ example: '8%', enum: ['0%', '5%', '8%', '10%', 'KCT', 'KKTT'], description: 'Thuế suất GTGT (Theo Nghị định 72/2024/NĐ-CP & TT78)' })
  @IsString()
  vatRateName: string;

  @ApiProperty({ example: 960000, description: 'Tiền thuế GTGT (VND)' })
  @IsNumber()
  vatAmount: number;

  @ApiProperty({ example: 12960000, description: 'Tổng tiền thanh toán dòng hàng (VND)' })
  @IsNumber()
  amountWithVAT: number;
}

// ── 2. meInvoice - DRAFT & PUBLISH DTOs ──
export class MisaDraftInvoiceDto {
  @ApiProperty({ example: 'HD20261003-001', description: 'Mã tham chiếu nội bộ đơn hàng (RefID)' })
  @IsString()
  refID: string;

  @ApiProperty({ example: '1C26TAA', description: 'Ký hiệu mẫu số hóa đơn điện tử theo Thông tư 78 (1: HĐ GTGT, C: Có mã CQT, 26: Năm 2026, T: Doanh nghiệp, AA: Ký tự phân loại)' })
  @IsString()
  invSeries: string;

  @ApiProperty({ example: '2026-10-03', description: 'Ngày lập hóa đơn (YYYY-MM-DD)' })
  @IsString()
  invDate: string;

  @ApiProperty({ example: '0101243150', description: 'Mã số thuế bên bán (Đơn vị phát hành MISA)' })
  @IsString()
  sellerTaxCode: string;

  @ApiProperty({ example: 'Công ty Cổ phần MISA', description: 'Tên đơn vị bán lẻ / doanh nghiệp phát hành' })
  @IsString()
  sellerLegalName: string;

  @ApiProperty({ example: 'Công ty Cổ phần Công Nghệ Alpha Đông Nam', description: 'Tên đơn vị người mua hàng' })
  @IsString()
  buyerLegalName: string;

  @ApiProperty({ example: '0108999888', description: 'Mã số thuế bên mua (10 hoặc 13 số chuẩn Tổng Cục Thuế)' })
  @IsString()
  buyerTaxCode: string;

  @ApiProperty({ example: 'Tầng 6, Tòa nhà Keangnam Landmark 72, Đường Phạm Hùng, Phường Mễ Trì, Quận Nam Từ Liêm, Hà Nội', description: 'Địa chỉ người mua theo GPKD' })
  @IsString()
  buyerAddress: string;

  @ApiProperty({ example: 'ketoan@alpha-tech.vn', description: 'Email nhận hóa đơn điện tử', required: false })
  @IsOptional()
  @IsString()
  buyerEmail?: string;

  @ApiProperty({ example: '02473008899', description: 'Số điện thoại bên mua', required: false })
  @IsOptional()
  @IsString()
  buyerPhone?: string;

  @ApiProperty({ example: 'TM/CK', enum: ['TM', 'CK', 'TM/CK', 'DTCN'], description: 'Hình thức thanh toán (Tiền mặt / Chuyển khoản)' })
  @IsString()
  paymentMethod: string;

  @ApiProperty({ example: 12000000, description: 'Tổng tiền trước thuế GTGT (VND)' })
  @IsNumber()
  totalAmountWithoutVAT: number;

  @ApiProperty({ example: 960000, description: 'Tổng tiền thuế GTGT (VND)' })
  @IsNumber()
  totalVATAmount: number;

  @ApiProperty({ example: 12960000, description: 'Tổng tiền thanh toán trên hóa đơn (VND)' })
  @IsNumber()
  totalAmount: number;

  @ApiProperty({
    type: [MisaInvoiceDetailLineDto],
    description: 'Chi tiết danh mục hàng hóa / dịch vụ tính thuế GTGT',
    example: [
      {
        lineNumber: 1,
        itemCode: 'SP-SERVER-01',
        itemName: 'Dịch vụ Thuê Máy Chủ Đám Mây Cloud Server Standard (Gói 12 tháng)',
        unit: 'Gói',
        quantity: 1,
        unitPrice: 12000000,
        amountWithoutVAT: 12000000,
        vatRateName: '8%',
        vatAmount: 960000,
        amountWithVAT: 12960000,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MisaInvoiceDetailLineDto)
  originalInvoiceDetail: MisaInvoiceDetailLineDto[];
}

export class MisaPublishHsmDto {
  @ApiProperty({ example: 'HD20261003-001', description: 'Mã tham chiếu đơn hàng cần ký số HSM Cloud và cấp mã CQT' })
  @IsString()
  refID: string;

  @ApiProperty({ example: true, description: 'Tự động gửi email thông báo phát hành kèm link xem hóa đơn cho bên mua', required: false })
  @IsOptional()
  @IsBoolean()
  sendEmailToBuyer?: boolean;
}

export class MisaPublishMultiHsmDto {
  @ApiProperty({ example: ['HD20261003-001', 'HD20261003-002', 'HD20261003-003'], description: 'Danh sách RefID các hóa đơn cần ký số HSM hàng loạt' })
  @IsArray()
  refIDs: string[];
}

// ── 3. meInvoice - LIFECYCLE (CANCEL, REPLACE, ADJUST) ──
export class MisaCancelInvoiceDto {
  @ApiProperty({ example: 'HD20261003-001', description: 'Mã tham chiếu hóa đơn gốc cần hủy' })
  @IsString()
  refID: string;

  @ApiProperty({ example: 'Hủy đơn do người mua không nhận hàng và hai bên thống nhất lập biên bản hủy', description: 'Lý do hủy hóa đơn' })
  @IsString()
  cancelReason: string;

  @ApiProperty({ example: '2026-10-03', description: 'Ngày lập biên bản hủy (YYYY-MM-DD)' })
  @IsString()
  noticeDocDate: string;

  @ApiProperty({ example: 'BB-HUY-01/2026', description: 'Số biên bản thỏa thuận hủy hóa đơn' })
  @IsString()
  noticeDocNo: string;
}

export class MisaReplaceInvoiceDto {
  @ApiProperty({ example: 'HD20261003-REPLACE-01', description: 'Mã tham chiếu hóa đơn thay thế mới' })
  @IsString()
  newRefID: string;

  @ApiProperty({ example: 'HD20261003-001', description: 'Mã tham chiếu hóa đơn bị sai sót cần thay thế' })
  @IsString()
  originalRefID: string;

  @ApiProperty({ example: 'Thay thế do sai sót mã số thuế và tên pháp nhân bên mua', description: 'Lý do thay thế hóa đơn' })
  @IsString()
  replaceReason: string;

  @ApiProperty({ type: MisaDraftInvoiceDto, description: 'Nội dung hóa đơn thay thế mới đã hiệu chỉnh chuẩn' })
  newInvoiceData: MisaDraftInvoiceDto;
}

export class MisaAdjustInvoiceDto {
  @ApiProperty({ example: 'HD20261003-ADJUST-01', description: 'Mã tham chiếu hóa đơn điều chỉnh' })
  @IsString()
  adjustRefID: string;

  @ApiProperty({ example: 'HD20261003-001', description: 'Mã tham chiếu hóa đơn gốc bị điều chỉnh' })
  @IsString()
  originalRefID: string;

  @ApiProperty({ example: 'DECREASE', enum: ['INCREASE', 'DECREASE', 'INFO_ONLY'], description: 'Loại điều chỉnh (Tăng, Giảm, hoặc Chỉ điều chỉnh thông tin)' })
  @IsString()
  adjustmentType: string;

  @ApiProperty({ example: 'Điều chỉnh giảm doanh thu 1,000,000 VND do áp dụng chính sách chiết khấu thương mại', description: 'Lý do lập hóa đơn điều chỉnh' })
  @IsString()
  adjustmentReason: string;

  @ApiProperty({ example: -1000000, description: 'Số tiền điều chỉnh chênh lệch trước thuế (VND)' })
  @IsNumber()
  adjustedAmountWithoutVAT: number;

  @ApiProperty({ example: -80000, description: 'Số tiền thuế GTGT điều chỉnh chênh lệch (VND)' })
  @IsNumber()
  adjustedVATAmount: number;

  @ApiProperty({ example: -1080000, description: 'Tổng tiền thanh toán chênh lệch điều chỉnh (VND)' })
  @IsNumber()
  adjustedTotalAmount: number;
}
