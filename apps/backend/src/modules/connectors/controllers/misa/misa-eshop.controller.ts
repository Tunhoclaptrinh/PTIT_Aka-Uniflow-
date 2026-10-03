import { Controller, Post, Get, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import {
  MisaEshopCreateOrderDto,
  MisaEshopReturnOrderDto,
  MisaEshopCreateProductDto,
  MisaEshopUpdateProductDto,
  MisaEshopAdjustStockDto,
  MisaEshopStocktakeDto,
  MisaEshopCreateCustomerDto,
  MisaEshopAdjustPointsDto,
  MisaEshopOpenShiftDto,
  MisaEshopCloseShiftDto,
  MisaEshopValidateVoucherDto,
  MisaEshopCashflowDto,
  MisaEshopShippingPartnerDto,
} from '../../dto/pos-misa-eshop.dto';

// ════════════════════════════════════════════════════════════════
// 1. MISA eShop - ORDERS RESOURCE
// ════════════════════════════════════════════════════════════════
@ApiTags('[04. ERP-MISA-eShop] 01. Orders')
@Controller('api/v1/infra/misa-eshop')
export class MisaEshopOrdersController {
  @ApiOperation({
    summary: 'Tạo hóa đơn bán lẻ MISA eShop',
    description: 'Endpoint gốc: POST /api/orders/create | Khởi tạo hóa đơn bán lẻ trực tiếp từ máy thu ngân POS MISA eShop tại chi nhánh cửa hàng',
  })
  @ApiBody({ type: MisaEshopCreateOrderDto })
  @Post('orders/create')
  async createOrder(@Body() dto: MisaEshopCreateOrderDto) {
    return {
      success: true,
      data: {
        orderId: Date.now(),
        orderNo: dto.orderNo,
        branchCode: dto.branchCode,
        cashier: dto.cashier,
        customerName: dto.customerName,
        customerPhone: dto.customerPhone,
        itemsCount: dto.items?.length || 0,
        subTotal: dto.subTotal,
        discountTotal: dto.discountTotal || 0,
        totalAmount: dto.totalAmount,
        paymentType: dto.paymentType,
        status: 'PAID',
        createdDate: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: 'Danh sách hóa đơn MISA eShop',
    description: 'Endpoint gốc: GET /api/orders/list | Tra cứu danh sách hóa đơn bán hàng theo chi nhánh và ca thu ngân',
  })
  @ApiQuery({ name: 'branchCode', example: 'CN_CAUGIAY', required: false })
  @ApiQuery({ name: 'fromDate', example: '2026-10-01', required: false })
  @ApiQuery({ name: 'toDate', example: '2026-10-03', required: false })
  @Get('orders/list')
  async listOrders(
    @Query('branchCode') branchCode: string = 'CN_CAUGIAY',
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return {
      total: 2,
      branchCode,
      data: [
        {
          orderNo: 'HD-ESHOP-20261003-088',
          totalAmount: 114000,
          cashier: 'Nguyễn Thu Ngân',
          paymentType: 'VIETQR',
          createdDate: new Date().toISOString(),
          status: 'PAID',
        },
        {
          orderNo: 'HD-ESHOP-20261003-087',
          totalAmount: 95000,
          cashier: 'Nguyễn Thu Ngân',
          paymentType: 'CASH',
          createdDate: new Date(Date.now() - 3600000).toISOString(),
          status: 'PAID',
        },
      ],
    };
  }

  @ApiOperation({
    summary: 'Chi tiết hóa đơn MISA eShop',
    description: 'Endpoint gốc: GET /api/orders/:id | Xem chi tiết danh sách mặt hàng, chiết khấu, VAT và thông tin thanh toán của hóa đơn POS',
  })
  @ApiParam({ name: 'id', example: 'HD-ESHOP-20261003-088' })
  @Get('orders/:id')
  async getOrderById(@Param('id') id: string) {
    return {
      success: true,
      data: {
        orderNo: id,
        branchCode: 'CN_CAUGIAY',
        cashier: 'Nguyễn Thu Ngân',
        customerName: 'Hoàng Hải Yến',
        items: [
          { itemCode: 'SP-TS-001', itemName: 'Trà Sữa Oolong Nướng Trân Châu Hoàng Kim', quantity: 2, price: 45000, amount: 85000 },
          { itemCode: 'SP-CAFE-002', itemName: 'Cà Phê Muối Cốm Hà Nội', quantity: 1, price: 39000, amount: 39000 },
        ],
        subTotal: 124000,
        discountTotal: 10000,
        totalAmount: 114000,
        paymentType: 'VIETQR',
        status: 'PAID',
      },
    };
  }

  @ApiOperation({
    summary: 'Hủy hóa đơn MISA eShop',
    description: 'Endpoint gốc: DELETE /api/orders/:id | Hủy hóa đơn bán lẻ và tự động hoàn trả số lượng vào tồn kho chi nhánh',
  })
  @ApiParam({ name: 'id', example: 'HD-ESHOP-20261003-088' })
  @Delete('orders/:id')
  async deleteOrder(@Param('id') id: string) {
    return {
      success: true,
      message: `Đã hủy hóa đơn MISA eShop #${id} và hoàn tồn kho thành công`,
      restocked: true,
    };
  }

  @ApiOperation({
    summary: 'Đổi trả hàng / Hoàn tiền hóa đơn MISA eShop',
    description: 'Endpoint gốc: POST /api/orders/:id/return | Xử lý nghiệp vụ trả hàng hoàn tiền một phần hoặc toàn phần cho khách hàng tại quầy',
  })
  @ApiParam({ name: 'id', example: 'HD-ESHOP-20261003-088' })
  @ApiBody({ type: MisaEshopReturnOrderDto })
  @Post('orders/:id/return')
  async returnOrder(@Param('id') id: string, @Body() dto: MisaEshopReturnOrderDto) {
    return {
      success: true,
      data: {
        returnVoucherNo: `TH-${id}`,
        originalOrderNo: id,
        returnReason: dto.returnReason,
        refundAmount: dto.refundAmount,
        refundMethod: dto.refundMethod,
        processedDate: new Date().toISOString(),
      },
    };
  }
}

// ════════════════════════════════════════════════════════════════
// 2. MISA eShop - PRODUCTS RESOURCE
// ════════════════════════════════════════════════════════════════
@ApiTags('[04. ERP-MISA-eShop] 02. Products')
@Controller('api/v1/infra/misa-eshop')
export class MisaEshopProductsController {
  @ApiOperation({
    summary: 'Thêm mới hàng hóa MISA eShop',
    description: 'Endpoint gốc: POST /api/products/create | Khai báo mặt hàng mới, giá vốn, giá bán và tồn kho ban đầu',
  })
  @ApiBody({ type: MisaEshopCreateProductDto })
  @Post('products/create')
  async createProduct(@Body() dto: MisaEshopCreateProductDto) {
    return {
      success: true,
      data: {
        productId: `PRD_${Date.now()}`,
        productCode: dto.productCode,
        productName: dto.productName,
        categoryCode: dto.categoryCode,
        unit: dto.unit,
        costPrice: dto.costPrice,
        salePrice: dto.salePrice,
        branchCode: dto.branchCode,
        isAvailableForSale: dto.isAvailableForSale,
        createdDate: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: 'Danh sách hàng hóa MISA eShop',
    description: 'Endpoint gốc: GET /api/products/list | Tra cứu danh sách sản phẩm, giá bán và trạng thái kinh doanh',
  })
  @ApiQuery({ name: 'keyword', example: 'Trà Sữa', required: false })
  @ApiQuery({ name: 'categoryCode', example: 'NHOM_TRA_TRAI_CAY', required: false })
  @Get('products/list')
  async listProducts(@Query('keyword') keyword?: string, @Query('categoryCode') categoryCode?: string) {
    return {
      total: 2,
      data: [
        {
          productCode: 'SP-TS-001',
          productName: 'Trà Sữa Oolong Nướng Trân Châu Hoàng Kim',
          categoryCode: categoryCode || 'NHOM_TRA_SUA',
          unit: 'Ly',
          salePrice: 45000,
          costPrice: 18000,
          isActive: true,
        },
        {
          productCode: 'SP-CAFE-002',
          productName: 'Cà Phê Muối Cốm Hà Nội',
          categoryCode: categoryCode || 'NHOM_CAFE',
          unit: 'Ly',
          salePrice: 39000,
          costPrice: 15000,
          isActive: true,
        },
      ],
    };
  }

  @ApiOperation({
    summary: 'Chi tiết hàng hóa MISA eShop',
    description: 'Endpoint gốc: GET /api/products/:id | Lấy chi tiết thông tin định mức, đơn vị tính và giá bán của sản phẩm',
  })
  @ApiParam({ name: 'id', example: 'SP-TS-001' })
  @Get('products/:id')
  async getProductById(@Param('id') id: string) {
    return {
      success: true,
      data: {
        productCode: id,
        productName: 'Trà Sữa Oolong Nướng Trân Châu Hoàng Kim',
        categoryCode: 'NHOM_TRA_SUA',
        categoryName: 'Nhóm Trà Sữa Đặc Biệt',
        unit: 'Ly Lớn (Size L)',
        costPrice: 18000,
        salePrice: 45000,
        barcode: '8936001122334',
        isActive: true,
      },
    };
  }

  @ApiOperation({
    summary: 'Cập nhật hàng hóa MISA eShop',
    description: 'Endpoint gốc: PUT /api/products/:id | Cập nhật thông tin giá bán, tên món hoặc bật/tắt trạng thái kinh doanh',
  })
  @ApiParam({ name: 'id', example: 'SP-TS-001' })
  @ApiBody({ type: MisaEshopUpdateProductDto })
  @Put('products/:id')
  async updateProduct(@Param('id') id: string, @Body() dto: MisaEshopUpdateProductDto) {
    return {
      success: true,
      message: `Đã cập nhật mặt hàng #${id} thành công`,
      data: { productCode: id, ...dto, updatedDate: new Date().toISOString() },
    };
  }

  @ApiOperation({
    summary: 'Danh mục nhóm hàng hóa MISA eShop',
    description: 'Endpoint gốc: GET /api/categories/list | Danh sách các nhóm hàng, danh mục thực đơn đang áp dụng',
  })
  @Get('categories/list')
  async listCategories() {
    return {
      total: 3,
      data: [
        { categoryCode: 'NHOM_TRA_SUA', categoryName: 'Trà Sữa & Topping', itemCount: 24 },
        { categoryCode: 'NHOM_TRA_TRAI_CAY', categoryName: 'Trà Trái Cây Tươi', itemCount: 18 },
        { categoryCode: 'NHOM_CAFE', categoryName: 'Cà Phê Truyền Thống & Hiện Đại', itemCount: 12 },
      ],
    };
  }
}

// ════════════════════════════════════════════════════════════════
// 3. MISA eShop - INVENTORY RESOURCE
// ════════════════════════════════════════════════════════════════
@ApiTags('[04. ERP-MISA-eShop] 03. Inventory')
@Controller('api/v1/infra/misa-eshop')
export class MisaEshopInventoryController {
  @ApiOperation({
    summary: 'Đồng bộ & Điều chỉnh tồn kho MISA eShop',
    description: 'Endpoint gốc: POST /api/inventory/adjust | Cập nhật số lượng tồn kho thực tế cho sản phẩm tại chi nhánh cửa hàng',
  })
  @ApiBody({ type: MisaEshopAdjustStockDto })
  @Post('inventory/adjust')
  async adjustStock(@Body() dto: MisaEshopAdjustStockDto) {
    return {
      success: true,
      data: {
        branchCode: dto.branchCode,
        itemCode: dto.itemCode,
        onHand: dto.onHand,
        reason: dto.reason || 'Điều chỉnh tồn kho thường kỳ',
        updatedDate: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: 'Tra cứu tồn kho chi nhánh MISA eShop',
    description: 'Endpoint gốc: GET /api/inventory/balance | Xem số dư tồn kho sẵn sàng bán (On Hand) tại từng chi nhánh',
  })
  @ApiQuery({ name: 'branchCode', example: 'CN_CAUGIAY', required: false })
  @ApiQuery({ name: 'itemCode', example: 'SP-TS-001', required: false })
  @Get('inventory/balance')
  async getInventoryBalance(
    @Query('branchCode') branchCode: string = 'CN_CAUGIAY',
    @Query('itemCode') itemCode?: string,
  ) {
    return {
      branchCode,
      data: [
        { itemCode: itemCode || 'SP-TS-001', itemName: 'Trà Sữa Oolong Nướng', onHand: 120, allocated: 5, available: 115 },
        { itemCode: 'SP-CAFE-002', itemName: 'Cà Phê Muối Cốm', onHand: 48, allocated: 0, available: 48 },
      ],
    };
  }

  @ApiOperation({
    summary: 'Lập phiếu kiểm kê kho MISA eShop',
    description: 'Endpoint gốc: POST /api/inventory/stocktake | Ghi nhận kết quả kiểm đếm hàng tồn thực tế và cân bằng kho tự động',
  })
  @ApiBody({ type: MisaEshopStocktakeDto })
  @Post('inventory/stocktake')
  async createStocktake(@Body() dto: MisaEshopStocktakeDto) {
    return {
      success: true,
      data: {
        stocktakeCode: dto.stocktakeCode,
        branchCode: dto.branchCode,
        auditor: dto.auditor,
        totalItemsCount: dto.items?.length || 0,
        status: 'BALANCED_COMPLETED',
        completedDate: new Date().toISOString(),
      },
    };
  }
}

// ════════════════════════════════════════════════════════════════
// 4. MISA eShop - CUSTOMERS RESOURCE
// ════════════════════════════════════════════════════════════════
@ApiTags('[04. ERP-MISA-eShop] 04. Customers')
@Controller('api/v1/infra/misa-eshop')
export class MisaEshopCustomersController {
  @ApiOperation({
    summary: 'Tạo khách hàng mới MISA eShop',
    description: 'Endpoint gốc: POST /api/customers/create | Khai báo hồ sơ khách hàng mới, cấp thẻ thành viên và điểm thưởng',
  })
  @ApiBody({ type: MisaEshopCreateCustomerDto })
  @Post('customers/create')
  async createCustomer(@Body() dto: MisaEshopCreateCustomerDto) {
    return {
      success: true,
      data: {
        customerId: `CUST_${Date.now()}`,
        customerName: dto.customerName,
        phone: dto.phone,
        email: dto.email,
        tier: dto.tier,
        rewardPoints: dto.initialPoints || 0,
        totalSpent: 0,
        createdDate: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: 'Tìm kiếm khách hàng theo SĐT MISA eShop',
    description: 'Endpoint gốc: GET /api/customers/search | Tra cứu khách hàng tại quầy thu ngân để áp dụng chiết khấu VIP và tích điểm',
  })
  @ApiQuery({ name: 'phone', example: '0988123456' })
  @Get('customers/search')
  async searchCustomer(@Query('phone') phone: string) {
    return {
      success: true,
      data: {
        customerId: 'CUST_202610_008',
        customerName: 'Hoàng Hải Yến',
        phone,
        tier: 'VIP_GOLD',
        discountPercent: 10,
        rewardPoints: 240,
        totalSpent: 12500000,
        lastVisitDate: '2026-10-01T15:30:00Z',
      },
    };
  }

  @ApiOperation({
    summary: 'Lịch sử tích điểm & Thẻ thành viên',
    description: 'Endpoint gốc: GET /api/customers/:id/loyalty | Xem chi tiết số dư điểm thưởng và lịch sử cộng/trừ điểm theo hóa đơn',
  })
  @ApiParam({ name: 'id', example: 'CUST_202610_008' })
  @Get('customers/:id/loyalty')
  async getCustomerLoyalty(@Param('id') id: string) {
    return {
      customerId: id,
      currentPoints: 240,
      tier: 'VIP_GOLD',
      history: [
        { date: '2026-10-03', action: 'EARN', points: +11, orderNo: 'HD-ESHOP-20261003-088', reason: 'Tích điểm đơn hàng' },
        { date: '2026-09-25', action: 'REDEEM', points: -50, orderNo: 'HD-ESHOP-20260925-012', reason: 'Đổi voucher giảm giá 50k' },
      ],
    };
  }

  @ApiOperation({
    summary: 'Điều chỉnh điểm thưởng khách hàng',
    description: 'Endpoint gốc: POST /api/customers/:id/adjust-points | Cộng hoặc trừ điểm thưởng thủ công cho khách hàng',
  })
  @ApiParam({ name: 'id', example: 'CUST_202610_008' })
  @ApiBody({ type: MisaEshopAdjustPointsDto })
  @Post('customers/:id/adjust-points')
  async adjustCustomerPoints(@Param('id') id: string, @Body() dto: MisaEshopAdjustPointsDto) {
    return {
      success: true,
      data: {
        customerId: id,
        adjustedPoints: dto.pointAdjustment,
        newBalance: 290,
        reason: dto.reason,
        updatedDate: new Date().toISOString(),
      },
    };
  }
}

// ════════════════════════════════════════════════════════════════
// 5. MISA eShop - SHIFTS RESOURCE
// ════════════════════════════════════════════════════════════════
@ApiTags('[04. ERP-MISA-eShop] 05. Shifts')
@Controller('api/v1/infra/misa-eshop')
export class MisaEshopShiftsController {
  @ApiOperation({
    summary: 'Mở ca thu ngân mới MISA eShop',
    description: 'Endpoint gốc: POST /api/shift/open | Khai báo quỹ tiền mặt đầu ca và bàn giao máy thu ngân cho nhân viên',
  })
  @ApiBody({ type: MisaEshopOpenShiftDto })
  @Post('shift/open')
  async openShift(@Body() dto: MisaEshopOpenShiftDto) {
    return {
      success: true,
      data: {
        shiftId: dto.shiftId,
        branchCode: dto.branchCode,
        cashier: dto.cashier,
        cashBeginning: dto.cashBeginning,
        status: 'SHIFT_OPENED',
        openedDate: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: 'Bàn giao ca thu ngân & Chốt sổ két MISA eShop',
    description: 'Endpoint gốc: POST /api/shift/close | Chốt doanh thu bán hàng ca, kiểm đếm tiền mặt két và bàn giao ca kế tiếp',
  })
  @ApiBody({ type: MisaEshopCloseShiftDto })
  @Post('shift/close')
  async closeShift(@Body() dto: MisaEshopCloseShiftDto) {
    return {
      success: true,
      data: {
        shiftId: dto.shiftId,
        branchCode: dto.branchCode,
        cashier: dto.cashier,
        cashBeginning: dto.cashBeginning,
        cashCollected: dto.cashCollected,
        cashActualInDrawer: dto.cashActualInDrawer,
        digitalPaymentRevenue: dto.digitalPaymentRevenue,
        totalOrders: dto.totalOrders,
        variance: dto.variance,
        status: 'SHIFT_CLOSED_BALANCED',
        closedDate: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: 'Trạng thái ca thu ngân hiện tại',
    description: 'Endpoint gốc: GET /api/shift/status | Kiểm tra doanh thu tạm tính, số đơn đã xuất và thu ngân phụ trách',
  })
  @ApiQuery({ name: 'branchCode', example: 'CN_CAUGIAY', required: false })
  @Get('shift/status')
  async getShiftStatus(@Query('branchCode') branchCode: string = 'CN_CAUGIAY') {
    return {
      branchCode,
      currentShiftId: 'SHIFT-20261003-CA01',
      cashier: 'Trần Thị Thu Ngân',
      cashBeginning: 1500000,
      currentRevenue: 11350000,
      digitalRevenue: 15400000,
      totalOrdersInShift: 58,
      status: 'ACTIVE',
    };
  }

  @ApiOperation({
    summary: 'Lịch sử các ca thu ngân chi nhánh',
    description: 'Endpoint gốc: GET /api/shift/history | Tra cứu danh sách các ca thu ngân đã đóng trong khoảng thời gian',
  })
  @ApiQuery({ name: 'branchCode', example: 'CN_CAUGIAY', required: false })
  @ApiQuery({ name: 'fromDate', example: '2026-10-01', required: false })
  @ApiQuery({ name: 'toDate', example: '2026-10-03', required: false })
  @Get('shift/history')
  async getShiftHistory(
    @Query('branchCode') branchCode: string = 'CN_CAUGIAY',
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return {
      branchCode,
      total: 2,
      data: [
        {
          shiftId: 'SHIFT-20261002-CA02',
          cashier: 'Nguyễn Thu Ngân',
          totalRevenue: 24500000,
          ordersCount: 65,
          closedDate: '2026-10-02T22:30:00Z',
          status: 'CLOSED',
        },
        {
          shiftId: 'SHIFT-20261002-CA01',
          cashier: 'Trần Thị Thu Ngân',
          totalRevenue: 18200000,
          ordersCount: 42,
          closedDate: '2026-10-02T14:30:00Z',
          status: 'CLOSED',
        },
      ],
    };
  }
}

// ════════════════════════════════════════════════════════════════
// 6. MISA eShop - PROMOTIONS RESOURCE
// ════════════════════════════════════════════════════════════════
@ApiTags('[04. ERP-MISA-eShop] 06. Promotions')
@Controller('api/v1/infra/misa-eshop')
export class MisaEshopPromotionsController {
  @ApiOperation({
    summary: 'Danh sách chương trình khuyến mại MISA eShop',
    description: 'Endpoint gốc: GET /api/promotions/list | Lấy danh sách các CTKM giảm giá, tặng món, chiết khấu hóa đơn đang kích hoạt',
  })
  @Get('promotions/list')
  async listPromotions() {
    return {
      total: 2,
      data: [
        {
          promotionId: 'KM-2026-T10-01',
          title: 'Ưu Đãi Giờ Vàng Mua 2 Tặng 1',
          discountType: 'BUY_X_GET_Y',
          validFrom: '2026-10-01T00:00:00Z',
          validTo: '2026-10-31T23:59:59Z',
          status: 'ACTIVE',
        },
        {
          promotionId: 'KM-2026-T10-02',
          title: 'Voucher Giảm 20k Cho Đơn Từ 100k',
          discountType: 'COUPON_FIXED',
          voucherCode: 'ESHOP-VIP20K',
          status: 'ACTIVE',
        },
      ],
    };
  }

  @ApiOperation({
    summary: 'Kiểm tra & Áp dụng Voucher MISA eShop',
    description: 'Endpoint gốc: POST /api/promotions/validate-voucher | Xác thực điều kiện sử dụng mã voucher trên tổng tiền hóa đơn thực tế',
  })
  @ApiBody({ type: MisaEshopValidateVoucherDto })
  @Post('promotions/validate-voucher')
  async validateVoucher(@Body() dto: MisaEshopValidateVoucherDto) {
    const isValid = dto.voucherCode.toUpperCase().includes('20K');
    const discountAmount = isValid ? 20000 : 0;
    return {
      success: isValid,
      voucherCode: dto.voucherCode,
      isValid,
      discountAmount,
      finalAmount: Math.max(0, dto.orderAmount - discountAmount),
      message: isValid ? 'Áp dụng mã voucher thành công (-20,000 VND)' : 'Mã voucher không hợp lệ hoặc đã hết lượt sử dụng',
    };
  }
}

// ════════════════════════════════════════════════════════════════
// 7. MISA eShop - CASHFLOW (SỔ QUỸ TIỀN MẶT CỬA HÀNG)
// ════════════════════════════════════════════════════════════════
@ApiTags('[04. ERP-MISA-eShop] 07. Cashflow')
@Controller('api/v1/infra/misa-eshop')
export class MisaEshopCashflowController {
  @ApiOperation({
    summary: '[Cashflow - Phiếu thu tiền mặt] [POST /cashflow/receipt] Lập phiếu thu quỹ tại cửa hàng',
    description: 'Endpoint gốc: POST /api/cashflow/receipt | Lập phiếu thu tiền mặt vào két thu ngân ngoài tiền bán hàng (thu nợ, bán phế liệu, tiền nạp đầu ca...)',
  })
  @ApiBody({ type: MisaEshopCashflowDto })
  @Post('cashflow/receipt')
  async createCashReceipt(@Body() dto: MisaEshopCashflowDto) {
    return {
      success: true,
      voucherId: `ESHOP_CR_${Date.now()}`,
      branchCode: dto.branchCode,
      voucherType: 'RECEIPT',
      amount: dto.amount,
      reason: dto.reason,
      createdByName: dto.createdByName,
      createdAt: new Date().toISOString(),
      message: 'Lập phiếu thu tiền mặt vào quỹ thành công',
    };
  }

  @ApiOperation({
    summary: '[Cashflow - Phiếu chi tiền mặt] [POST /cashflow/payment] Lập phiếu chi quỹ tại cửa hàng',
    description: 'Endpoint gốc: POST /api/cashflow/payment | Lập phiếu chi tiền mặt từ két (chi mua đồ vặt, tiền ship ứng, nộp tiền về ngân hàng...)',
  })
  @ApiBody({ type: MisaEshopCashflowDto })
  @Post('cashflow/payment')
  async createCashPayment(@Body() dto: MisaEshopCashflowDto) {
    return {
      success: true,
      voucherId: `ESHOP_CP_${Date.now()}`,
      branchCode: dto.branchCode,
      voucherType: 'PAYMENT',
      amount: dto.amount,
      reason: dto.reason,
      createdByName: dto.createdByName,
      createdAt: new Date().toISOString(),
      message: 'Lập phiếu chi tiền mặt thành công',
    };
  }

  @ApiOperation({
    summary: '[Cashflow - Danh sách sổ quỹ] [GET /cashflow/transactions] Lịch sử thu/chi tiền mặt theo chi nhánh',
    description: 'Endpoint gốc: GET /api/cashflow/transactions | Tra cứu lịch sử dòng tiền mặt vào/ra két thu ngân theo ngày',
  })
  @ApiQuery({ name: 'branchCode', example: 'CN_CAUGIAY' })
  @ApiQuery({ name: 'fromDate', example: '2026-10-01', required: false })
  @ApiQuery({ name: 'toDate', example: '2026-10-03', required: false })
  @Get('cashflow/transactions')
  async listCashflowTransactions(
    @Query('branchCode') branchCode: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return {
      total: 2,
      branchCode: branchCode || 'CN_CAUGIAY',
      period: { fromDate: fromDate || '2026-10-01', toDate: toDate || '2026-10-03' },
      data: [
        {
          voucherId: 'ESHOP_CR_001',
          type: 'RECEIPT',
          amount: 2500000,
          reason: 'Bán thùng carton cũ',
          createdByName: 'Thu Ngân 1',
          date: '2026-10-03T11:00:00Z',
        },
        {
          voucherId: 'ESHOP_CP_001',
          type: 'PAYMENT',
          amount: 150000,
          reason: 'Mua nước lau kính và giấy in nhiệt',
          createdByName: 'Thu Ngân 1',
          date: '2026-10-03T14:30:00Z',
        },
      ],
    };
  }
}

// ════════════════════════════════════════════════════════════════
// 8. MISA eShop - SHIPPING PARTNERS (ĐỐI TÁC VẬN CHUYỂN LIÊN KẾT)
// ════════════════════════════════════════════════════════════════
@ApiTags('[04. ERP-MISA-eShop] 08. Shipping Partners')
@Controller('api/v1/infra/misa-eshop')
export class MisaEshopShippingPartnersController {
  @ApiOperation({
    summary: '[Shipping Partners - Danh sách hãng ship] [GET /shipping-partners] Danh sách hãng ship kết nối',
    description: 'Endpoint gốc: GET /api/shipping-partners | Tra cứu các đối tác vận chuyển đã kết nối với tài khoản MISA eShop (GHTK, GHN, Viettel Post...)',
  })
  @Get('shipping-partners')
  async listShippingPartners() {
    return {
      total: 3,
      data: [
        { carrierCode: 'GHTK', carrierName: 'Giao Hàng Tiết Kiệm (GHTK)', status: 'CONNECTED', isDefault: true },
        { carrierCode: 'GHN', carrierName: 'Giao Hàng Nhanh Express', status: 'CONNECTED', isDefault: false },
        { carrierCode: 'VIETTEL_POST', carrierName: 'Viettel Post', status: 'NOT_CONNECTED', isDefault: false },
      ],
    };
  }

  @ApiOperation({
    summary: '[Shipping Partners - Kết nối hãng ship] [POST /shipping-partners/connect] Cấu hình Token hãng vận chuyển',
    description: 'Endpoint gốc: POST /api/shipping-partners/connect | Thiết lập API Token của hãng vận chuyển để tự động đẩy vận đơn từ MISA eShop',
  })
  @ApiBody({ type: MisaEshopShippingPartnerDto })
  @Post('shipping-partners/connect')
  async connectShippingPartner(@Body() dto: MisaEshopShippingPartnerDto) {
    return {
      success: true,
      carrierCode: dto.carrierCode,
      carrierName: dto.carrierName,
      status: 'CONNECTED',
      connectedAt: new Date().toISOString(),
      message: `Đã kết nối thành công hãng vận chuyển ${dto.carrierName} với MISA eShop`,
    };
  }
}

