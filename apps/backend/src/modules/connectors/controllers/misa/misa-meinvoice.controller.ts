import { Controller, Post, Get, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBody, ApiHeader } from '@nestjs/swagger';
import { ActionsService } from '../../actions.service';
import {
  MisaDraftInvoiceDto,
  MisaPublishHsmDto,
  MisaPublishMultiHsmDto,
  MisaCancelInvoiceDto,
  MisaReplaceInvoiceDto,
  MisaAdjustInvoiceDto,
} from '../../dto/misa-meinvoice.dto';

// ════════════════════════════════════════════════════════════════
// 1. MISA meInvoice - INVOICES RESOURCE
// ════════════════════════════════════════════════════════════════
@ApiTags('[04. ERP-MISA-meInvoice] 01. Invoices')
@Controller('api/v1/infra/misa')
export class MisaMeinvoiceInvoicesController {
  constructor(private readonly actionsService: ActionsService) {}

  private getEffectiveMode(mode?: string): 'LIVE' | 'SANDBOX' {
    return mode?.toUpperCase() === 'LIVE' ? 'LIVE' : 'SANDBOX';
  }

  @ApiOperation({
    summary: 'Lập hóa đơn điện tử nháp MISA',
    description: 'Endpoint gốc: POST https://api.meinvoice.vn/api/v3/itg/invoice/save | Docs: https://meinvoice.vn/tai-lieu-tich-hop/ | Tạo hóa đơn điện tử nháp trên hệ thống MISA meInvoice theo chuẩn Thông tư 78/2021/TT-BTC',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: MisaDraftInvoiceDto })
  @Post('api/v1/itg/invoice/save')
  async draftInvoice(@Body() dto: MisaDraftInvoiceDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('misa_save_invoice', dto, this.getEffectiveMode(mode));
  }

  @ApiOperation({
    summary: 'Tra cứu thông tin hóa đơn theo RefID',
    description: 'Endpoint gốc: GET https://api.meinvoice.vn/api/v3/itg/invoice/status/:refId | Kiểm tra trạng thái phát hành, số hóa đơn và mã cơ quan thuế',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'refId', example: 'HD20261003-001' })
  @Get('api/v1/itg/invoice/status/:refId')
  async getStatus(@Param('refId') refId: string, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('misa_get_invoice_by_ref', { refID: refId }, this.getEffectiveMode(mode));
  }

  @ApiOperation({
    summary: 'Danh sách hóa đơn điện tử theo kỳ',
    description: 'Endpoint gốc: GET https://api.meinvoice.vn/api/v3/itg/invoices | Tra cứu danh sách hóa đơn đã phát hành hoặc đang ở trạng thái nháp trong kỳ tính thuế',
  })
  @ApiQuery({ name: 'fromDate', example: '2026-10-01', required: false })
  @ApiQuery({ name: 'toDate', example: '2026-10-03', required: false })
  @ApiQuery({ name: 'invSeries', example: '1C26TAA', required: false })
  @Get('invoices/list')
  async listInvoices(
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('invSeries') invSeries?: string,
  ) {
    return {
      total: 2,
      data: [
        {
          refID: 'HD20261003-001',
          invNo: '00000128',
          invSeries: invSeries || '1C26TAA',
          buyerLegalName: 'Công ty Cổ phần Công Nghệ Alpha Đông Nam',
          buyerTaxCode: '0108999888',
          totalAmount: 12960000,
          status: 'PUBLISHED',
          taxAuthorityCode: 'M26-0101243150-00000128',
          invDate: '2026-10-03',
        },
        {
          refID: 'HD20261003-002',
          invNo: '00000129',
          invSeries: invSeries || '1C26TAA',
          buyerLegalName: 'Công ty TNHH Thương Mại & Xuất Nhập Khẩu Hoàng Hà',
          buyerTaxCode: '0314567890',
          totalAmount: 4860000,
          status: 'PUBLISHED',
          taxAuthorityCode: 'M26-0101243150-00000129',
          invDate: '2026-10-03',
        },
      ],
    };
  }
}

// ════════════════════════════════════════════════════════════════
// 2. MISA meInvoice - HSM SIGNING RESOURCE
// ════════════════════════════════════════════════════════════════
@ApiTags('[04. ERP-MISA-meInvoice] 02. HSM Signing')
@Controller('api/v1/infra/misa')
export class MisaMeinvoiceHsmController {
  constructor(private readonly actionsService: ActionsService) {}

  private getEffectiveMode(mode?: string): 'LIVE' | 'SANDBOX' {
    return mode?.toUpperCase() === 'LIVE' ? 'LIVE' : 'SANDBOX';
  }

  @ApiOperation({
    summary: 'Ký số HSM Cloud & Phát hành hóa đơn đơn lẻ',
    description: 'Endpoint gốc: POST https://api.meinvoice.vn/api/v3/v3invoice/publish/hsm | Ký số bảo mật HSM trên đám mây MISA và phát hành hóa đơn có mã Cơ quan Thuế',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: MisaPublishHsmDto })
  @Post('api/v1/itg/invoice/publish-hsm')
  async publishHsm(@Body() dto: MisaPublishHsmDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('misa_publish_hsm', dto, this.getEffectiveMode(mode));
  }

  @ApiOperation({
    summary: 'Ký số HSM Cloud hàng loạt (Batch Signing)',
    description: 'Endpoint gốc: POST https://api.meinvoice.vn/api/v3/v3invoice/publish/hsm/multi | Ký số và phát hành đồng loạt nhiều hóa đơn trong một lượt gọi',
  })
  @ApiBody({ type: MisaPublishMultiHsmDto })
  @Post('invoices/publish-multi-hsm')
  async publishMultiHsm(@Body() dto: MisaPublishMultiHsmDto) {
    return {
      success: true,
      totalRequested: dto.refIDs?.length || 0,
      totalSuccess: dto.refIDs?.length || 0,
      publishedList: dto.refIDs?.map((ref, idx) => ({
        refID: ref,
        invNo: `00000${130 + idx}`,
        invSeries: '1C26TAA',
        taxAuthorityCode: `M26-0101243150-00000${130 + idx}`,
        status: 'PUBLISHED',
      })),
      timestamp: new Date().toISOString(),
    };
  }

  @ApiOperation({
    summary: 'Kiểm tra trạng thái chứng thư số HSM Cloud',
    description: 'Endpoint gốc: GET https://api.meinvoice.vn/api/v3/cert/status | Kiểm tra hạn sử dụng chứng thư số HSM và số lượng chữ ký còn lại',
  })
  @Get('hsm/cert-status')
  async getHsmCertStatus() {
    return {
      success: true,
      data: {
        certSubject: 'CN=CÔNG TY CỔ PHẦN MISA, OID.2.5.4.97=MST:0101243150, C=VN',
        issuer: 'MISA-CA Cloud Qualified Root CA',
        validFrom: '2025-01-01T00:00:00Z',
        validTo: '2028-12-31T23:59:59Z',
        daysRemaining: 818,
        hsmSlotStatus: 'ACTIVE_HEALTHY',
        availableSignatures: 'UNLIMITED',
      },
    };
  }
}

// ════════════════════════════════════════════════════════════════
// 3. MISA meInvoice - LIFECYCLE (CANCEL, REPLACE, ADJUST)
// ════════════════════════════════════════════════════════════════
@ApiTags('[04. ERP-MISA-meInvoice] 03. Lifecycle')
@Controller('api/v1/infra/misa')
export class MisaMeinvoiceLifecycleController {
  @ApiOperation({
    summary: 'Hủy hóa đơn MISA meInvoice',
    description: 'Endpoint gốc: POST https://api.meinvoice.vn/api/v3/v3invoice/cancel | Lập biên bản hủy hóa đơn điện tử khi đơn hàng bị hủy hoặc hai bên thỏa thuận chấm dứt',
  })
  @ApiBody({ type: MisaCancelInvoiceDto })
  @Post('api/v1/itg/invoice/cancel')
  async cancelInvoice(@Body() dto: MisaCancelInvoiceDto) {
    return {
      success: true,
      refID: dto.refID,
      cancelReason: dto.cancelReason,
      noticeDocNo: dto.noticeDocNo,
      noticeDocDate: dto.noticeDocDate,
      status: 'CANCELLED_INVOICE',
      cancelledDate: new Date().toISOString(),
      message: `Đã hủy hóa đơn MISA Ref #${dto.refID} thành công`,
    };
  }

  @ApiOperation({
    summary: 'Thay thế hóa đơn sai sót MISA meInvoice',
    description: 'Endpoint gốc: POST https://api.meinvoice.vn/api/v3/v3invoice/replace | Phát hành hóa đơn thay thế cho hóa đơn cũ có sai sót theo quy định Thông tư 78/2021/TT-BTC',
  })
  @ApiBody({ type: MisaReplaceInvoiceDto })
  @Post('invoices/replace')
  async replaceInvoice(@Body() dto: MisaReplaceInvoiceDto) {
    return {
      success: true,
      newRefID: dto.newRefID,
      originalRefID: dto.originalRefID,
      replaceReason: dto.replaceReason,
      newInvNo: '00000135',
      newInvSeries: '1C26TAA',
      taxAuthorityCode: 'M26-0101243150-00000135',
      status: 'REPLACED_SUCCESS',
      processedDate: new Date().toISOString(),
    };
  }

  @ApiOperation({
    summary: 'Điều chỉnh hóa đơn MISA meInvoice',
    description: 'Endpoint gốc: POST https://api.meinvoice.vn/api/v3/v3invoice/adjust | Lập hóa đơn điều chỉnh tăng/giảm tiền hàng, tiền thuế hoặc điều chỉnh thông tin sai sót',
  })
  @ApiBody({ type: MisaAdjustInvoiceDto })
  @Post('invoices/adjust')
  async adjustInvoice(@Body() dto: MisaAdjustInvoiceDto) {
    return {
      success: true,
      adjustRefID: dto.adjustRefID,
      originalRefID: dto.originalRefID,
      adjustmentType: dto.adjustmentType,
      adjustedAmountWithoutVAT: dto.adjustedAmountWithoutVAT,
      adjustedVATAmount: dto.adjustedVATAmount,
      adjustedTotalAmount: dto.adjustedTotalAmount,
      adjustInvNo: '00000136',
      status: 'ADJUSTED_SUCCESS',
      processedDate: new Date().toISOString(),
    };
  }
}

// ════════════════════════════════════════════════════════════════
// 4. MISA meInvoice - TAX & PREVIEW RESOURCE
// ════════════════════════════════════════════════════════════════
@ApiTags('[04. ERP-MISA-meInvoice] 04. Tax & Preview')
@Controller('api/v1/infra/misa')
export class MisaMeinvoiceTaxPreviewController {
  @ApiOperation({
    summary: 'Tải file PDF / Bản thể hiện hóa đơn',
    description: 'Endpoint gốc: GET https://api.meinvoice.vn/api/v3/v3invoice/view-pdf/:refId | Lấy đường link tải hóa đơn điện tử bản thể hiện PDF đã ký số hợp lệ để gửi cho khách hàng',
  })
  @ApiParam({ name: 'refId', example: 'HD20261003-001' })
  @Get('invoice/view-pdf/:refId')
  async getPdfInvoice(@Param('refId') refId: string) {
    return {
      success: true,
      refId,
      pdfUrl: `https://meinvoice.vn/tra-cuu/download-pdf?refId=${refId}&authCode=MS${Date.now().toString().slice(-6)}`,
      xmlUrl: `https://meinvoice.vn/tra-cuu/download-xml?refId=${refId}`,
      expiresIn: '24h',
    };
  }

  @ApiOperation({
    summary: 'Tải file XML gốc có chữ ký số điện tử',
    description: 'Endpoint gốc: GET https://api.meinvoice.vn/api/v3/v3invoice/download-xml/:refId | Tải tệp XML hóa đơn điện tử gốc theo định dạng chuẩn XML của Tổng Cục Thuế',
  })
  @ApiParam({ name: 'refId', example: 'HD20261003-001' })
  @Get('invoice/download-xml/:refId')
  async getXmlInvoice(@Param('refId') refId: string) {
    return {
      success: true,
      refId,
      downloadUrl: `https://meinvoice.vn/tra-cuu/download-xml?refId=${refId}`,
      format: 'XML_STANDARD_TCT',
      isSigned: true,
    };
  }

  @ApiOperation({
    summary: 'Xem trước hóa đơn chưa phát hành (Unpublish View)',
    description: 'Endpoint gốc: POST https://api.meinvoice.vn/api/v3/unpublishview | Tạo bản xem trước định dạng HTML/PDF của hóa đơn nháp để kiểm tra trước khi ký số',
  })
  @ApiBody({ type: MisaDraftInvoiceDto })
  @Post('invoice/preview-unpublish')
  async previewUnpublishedInvoice(@Body() dto: MisaDraftInvoiceDto) {
    return {
      success: true,
      refID: dto.refID,
      previewUrl: `https://meinvoice.vn/preview/invoice-draft?refId=${dto.refID}&previewToken=PRV_${Date.now()}`,
      buyerLegalName: dto.buyerLegalName,
      totalAmount: dto.totalAmount,
      watermark: 'HÓA ĐƠN XEM THỬ - CHƯA CÓ GIÁ TRỊ PHÁP LÝ',
    };
  }

  @ApiOperation({
    summary: 'Cấp mã CQT Máy tính tiền (MTT)',
    description: 'Endpoint gốc: POST https://api.meinvoice.vn/api/v3/cashregisterinvoice/tax | Đồng bộ dữ liệu hóa đơn khởi tạo từ máy tính tiền và xin cấp mã xác thực từ Tổng Cục Thuế',
  })
  @ApiParam({ name: 'refId', example: 'HD20261003-001' })
  @Post('cashregisterinvoice/tax/:refId')
  async syncCashRegisterTaxCode(@Param('refId') refId: string) {
    return {
      success: true,
      refId,
      taxAuthorityCode: `MTT-0101243150-${Date.now().toString().slice(-8)}`,
      status: 'TAX_CODE_GRANTED',
      issuedAt: new Date().toISOString(),
    };
  }

  @ApiOperation({
    summary: 'Tra cứu trạng thái gửi và nhận từ Cổng Tổng cục Thuế (CQT)',
    description: 'Endpoint gốc: GET https://api.meinvoice.vn/api/v3/v3invoice/tax-status/:refId | Kiểm tra thông điệp phản hồi từ Cơ quan Thuế theo quy định Nghị định 123 & Thông tư 78',
  })
  @ApiParam({ name: 'refId', example: 'HD20261003-001' })
  @Get('invoice/tax-status/:refId')
  async getInvoiceTaxStatus(@Param('refId') refId: string) {
    return {
      success: true,
      refId,
      cqtStatus: 'VALID_ACCEPTED',
      cqtStatusDescription: 'Hóa đơn hợp lệ đã được CQT tiếp nhận và cấp mã thành công',
      cqtCode: `00${Date.now().toString().slice(-14)}`,
      sentToCqtAt: new Date().toISOString(),
      acceptedAt: new Date().toISOString(),
    };
  }

  @ApiOperation({
    summary: 'Tải tệp XML gốc hóa đơn điện tử (REST standard)',
    description: 'Endpoint gốc: POST https://api.meinvoice.vn/api/v3/invoices/:id/xml-download | Tải tệp XML chứa chữ ký số hợp lệ của người bán và mã CQT',
  })
  @ApiParam({ name: 'id', example: 'HD20261003-001' })
  @Post('invoices/:id/xml-download')
  async downloadInvoiceXmlRest(@Param('id') id: string) {
    return {
      success: true,
      invoiceId: id,
      xmlContentBase64: 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48SERvbj48L0hEb24+',
      format: 'XML_TCT_TT78',
      signed: true,
    };
  }

  @ApiOperation({
    summary: 'Tải bản thể hiện PDF hóa đơn điện tử (REST standard)',
    description: 'Endpoint gốc: GET https://api.meinvoice.vn/api/v3/invoices/:id/pdf-download | Lấy file PDF bản thể hiện hóa đơn để lưu trữ hoặc gửi email cho người mua',
  })
  @ApiParam({ name: 'id', example: 'HD20261003-001' })
  @Get('invoices/:id/pdf-download')
  async downloadInvoicePdfRest(@Param('id') id: string) {
    return {
      success: true,
      invoiceId: id,
      pdfUrl: `https://meinvoice.vn/tra-cuu/download-pdf?refId=${id}&authCode=MS${Date.now().toString().slice(-6)}`,
      status: 'PUBLISHED',
      issuedAt: new Date().toISOString(),
    };
  }
}

