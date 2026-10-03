import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConnectorsController } from './connectors.controller';
import { ConnectorsService } from './connectors.service';
import { ActionsController } from './actions.controller';
import { ActionsService } from './actions.service';
import { SyncPollerService } from './sync-poller.service';
import { Connector, ConnectorSchema } from '../../database/schemas/connector.schema';
import { SyncEventLog, SyncEventLogSchema } from '../../database/schemas/sync-event-log.schema';
import { WebSocketModule } from '../websocket/websocket.module';
import { DeveloperPortalModule } from '../developer-portal/developer-portal.module';
import { NormalizerModule } from '../normalizer/normalizer.module';
import { SecurityService } from '../../security/security.service';

import { InfraGatewayController, SandboxSimulatorController } from './infra-gateway.controller';
import { MarketplacesController } from './controllers/marketplaces.controller';
import {
  PancakeOrdersController,
  PancakeOrderTagsController,
  PancakeCustomersController,
  PancakeProductsController,
  PancakeInventoryController,
  PancakePurchasesController,
  PancakePromotionsController,
  PancakeFinanceController,
  PancakeAnalyticsController,
  PancakeChannelsController,
  PancakeSystemController,
} from './controllers/pancake';
import {
  LogisticsGhtkController,
  LogisticsGhnController,
  LogisticsViettelPostController,
  LogisticsVnpostController,
  LogisticsJtNinjaVanController,
  LogisticsOnDemandController,
} from './controllers/logistics';
import { CorePromotionsController } from './controllers/core/core-promotions.controller';
import { NotificationGatewaysController } from './controllers/gateways/notification-gateways.controller';

// 1. NHANH.VN MODULAR CONTROLLERS (14 Modules)
import {
  NhanhOrdersController,
  NhanhShippingController,
  NhanhProductsController,
  NhanhInventoryController,
  NhanhCustomersController,
  NhanhBusinessController,
  NhanhBillingController,
  NhanhPromotionsController,
  NhanhAccountingController,
  NhanhIntegrationsController,
  NhanhWebhooksController,
  NhanhVpageController,
  NhanhReportsController,
  NhanhCategoriesController,
} from './controllers/nhanh';

// 2. SAPO FULL RESOURCE CONTROLLERS (Matching Sapo API Reference Sidebar)
import {
  SapoOrdersController,
  SapoFulfillmentsController,
  SapoTransactionsController,
  SapoRefundsController,
  SapoProductsController,
  SapoVariantsController,
  SapoProductImagesController,
  SapoCustomCollectionsController,
  SapoSmartCollectionsController,
  SapoCollectsController,
  SapoCustomersController,
  SapoCustomerAddressesController,
  SapoArticlesController,
  SapoBlogsController,
  SapoCommentsController,
  SapoPagesController,
  SapoPriceRulesController,
  SapoDiscountCodesController,
  SapoAssetsController,
  SapoMetafieldsController,
  SapoRedirectsController,
  SapoScriptTagsController,
  SapoInventoryLevelsController,
  SapoLocationsController,
  SapoWebhooksController,
  SapoEventsController,
  SapoFinanceController,
  SapoReportsController,
  SapoShipmentsController,
} from './controllers/sapo';

// 3. KIOTVIET MODULAR CONTROLLERS (7 Modules)
import {
  KiotVietInvoicesController,
  KiotVietProductsController,
  KiotVietInventoryController,
  KiotVietCustomersController,
  KiotVietBranchesController,
  KiotVietPromotionsController,
  KiotVietWebhooksController,
} from './controllers/kiotviet';

// 4. HARAVAN OMNICHANNEL MODULAR CONTROLLERS (12 Official Categories)
import {
  HaravanOrdersController,
  HaravanDraftOrdersController,
  HaravanFulfillmentsController,
  HaravanTransactionsController,
  HaravanRefundsController,
  HaravanProductsController,
  HaravanProductVariantsController,
  HaravanProductImagesController,
  HaravanCustomCollectionsController,
  HaravanSmartCollectionsController,
  HaravanCollectsController,
  HaravanInventoryLevelsController,
  HaravanLocationsController,
  HaravanInventoryAdjustmentsController,
  HaravanCustomersController,
  HaravanCustomerAddressesController,
  HaravanPriceRulesController,
  HaravanDiscountCodesController,
  HaravanPromotionsController,
  HaravanCarrierServicesController,
  HaravanArticlesController,
  HaravanBlogsController,
  HaravanCommentsController,
  HaravanPagesController,
  HaravanThemeAssetsController,
  HaravanMetafieldsController,
  HaravanRedirectScriptTagsController,
  HaravanEventsController,
  HaravanStorePropertiesController,
  HaravanWebhooksController,
  HaravanAccessScopesController,
} from './controllers/haravan';

// 5. MISA ECOSYSTEM RESOURCE CONTROLLERS (18 Dedicated Resources)
import {
  // MISA eShop (6)
  MisaEshopOrdersController,
  MisaEshopProductsController,
  MisaEshopInventoryController,
  MisaEshopCustomersController,
  MisaEshopShiftsController,
  MisaEshopPromotionsController,
  // MISA meInvoice (4)
  MisaMeinvoiceInvoicesController,
  MisaMeinvoiceHsmController,
  MisaMeinvoiceLifecycleController,
  MisaMeinvoiceTaxPreviewController,
  // MISA AMIS CRM (9)
  MisaAmisCrmAccountController,
  MisaAmisCrmCustomersController,
  MisaAmisCrmContactsController,
  MisaAmisCrmProductsController,
  MisaAmisCrmSaleOrdersController,
  MisaAmisCrmStocksController,
  MisaAmisCrmLeadsController,
  MisaAmisCrmOpportunitiesController,
  MisaAmisCrmQuotationsController,
  // MISA AMIS Accounting (4)
  MisaAmisAccountingVouchersController,
  MisaAmisAccountingProductsController,
  MisaAmisAccountingCallbackController,
  MisaAmisAccountingReportsController,
} from './controllers/misa';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Connector.name, schema: ConnectorSchema },
      { name: SyncEventLog.name, schema: SyncEventLogSchema },
    ]),
    WebSocketModule,
    DeveloperPortalModule,
    NormalizerModule,
  ],
  controllers: [
    // Base & Infra
    ConnectorsController,
    ActionsController,
    InfraGatewayController,
    SandboxSimulatorController,
    MarketplacesController,
    // Pancake POS Modular Controllers (11 Modules, 103+ Endpoints)
    PancakeOrdersController,
    PancakeOrderTagsController,
    PancakeCustomersController,
    PancakeProductsController,
    PancakeInventoryController,
    PancakePurchasesController,
    PancakePromotionsController,
    PancakeFinanceController,
    PancakeAnalyticsController,
    PancakeChannelsController,
    PancakeSystemController,

    // Logistics VN Ecosystem (6 Modules: GHTK, GHN, Viettel Post, VNPost, J&T/NinjaVan, Ahamove/GrabExpress)
    LogisticsGhtkController,
    LogisticsGhnController,
    LogisticsViettelPostController,
    LogisticsVnpostController,
    LogisticsJtNinjaVanController,
    LogisticsOnDemandController,
    CorePromotionsController,
    NotificationGatewaysController,

    // Nhanh.vn (14)
    NhanhOrdersController,
    NhanhShippingController,
    NhanhProductsController,
    NhanhInventoryController,
    NhanhCustomersController,
    NhanhBusinessController,
    NhanhBillingController,
    NhanhPromotionsController,
    NhanhAccountingController,
    NhanhIntegrationsController,
    NhanhWebhooksController,
    NhanhVpageController,
    NhanhReportsController,
    NhanhCategoriesController,

    // Sapo Full Resources (Matching Sapo API Reference Sidebar)
    SapoOrdersController,
    SapoFulfillmentsController,
    SapoTransactionsController,
    SapoRefundsController,
    SapoProductsController,
    SapoVariantsController,
    SapoProductImagesController,
    SapoCustomCollectionsController,
    SapoSmartCollectionsController,
    SapoCollectsController,
    SapoCustomersController,
    SapoCustomerAddressesController,
    SapoArticlesController,
    SapoBlogsController,
    SapoCommentsController,
    SapoPagesController,
    SapoPriceRulesController,
    SapoDiscountCodesController,
    SapoAssetsController,
    SapoMetafieldsController,
    SapoRedirectsController,
    SapoScriptTagsController,
    SapoInventoryLevelsController,
    SapoLocationsController,
    SapoWebhooksController,
    SapoEventsController,
    SapoFinanceController,
    SapoReportsController,
    SapoShipmentsController,

    // KiotViet (7)
    KiotVietInvoicesController,
    KiotVietProductsController,
    KiotVietInventoryController,
    KiotVietCustomersController,
    KiotVietBranchesController,
    KiotVietPromotionsController,
    KiotVietWebhooksController,

    // Haravan Omnichannel (12 Official Categories)
    HaravanOrdersController,
    HaravanDraftOrdersController,
    HaravanFulfillmentsController,
    HaravanTransactionsController,
    HaravanRefundsController,
    HaravanProductsController,
    HaravanProductVariantsController,
    HaravanProductImagesController,
    HaravanCustomCollectionsController,
    HaravanSmartCollectionsController,
    HaravanCollectsController,
    HaravanInventoryLevelsController,
    HaravanLocationsController,
    HaravanInventoryAdjustmentsController,
    HaravanCustomersController,
    HaravanCustomerAddressesController,
    HaravanPriceRulesController,
    HaravanDiscountCodesController,
    HaravanPromotionsController,
    HaravanCarrierServicesController,
    HaravanArticlesController,
    HaravanBlogsController,
    HaravanCommentsController,
    HaravanPagesController,
    HaravanThemeAssetsController,
    HaravanMetafieldsController,
    HaravanRedirectScriptTagsController,
    HaravanEventsController,
    HaravanStorePropertiesController,
    HaravanWebhooksController,
    HaravanAccessScopesController,

    // MISA Ecosystem (18 Resources)
    MisaEshopOrdersController,
    MisaEshopProductsController,
    MisaEshopInventoryController,
    MisaEshopCustomersController,
    MisaEshopShiftsController,
    MisaEshopPromotionsController,
    MisaMeinvoiceInvoicesController,
    MisaMeinvoiceHsmController,
    MisaMeinvoiceLifecycleController,
    MisaMeinvoiceTaxPreviewController,
    // MISA AMIS CRM (9)
    MisaAmisCrmAccountController,
    MisaAmisCrmCustomersController,
    MisaAmisCrmContactsController,
    MisaAmisCrmProductsController,
    MisaAmisCrmSaleOrdersController,
    MisaAmisCrmStocksController,
    MisaAmisCrmLeadsController,
    MisaAmisCrmOpportunitiesController,
    MisaAmisCrmQuotationsController,
    MisaAmisAccountingVouchersController,
    MisaAmisAccountingProductsController,
    MisaAmisAccountingCallbackController,
    MisaAmisAccountingReportsController,
  ],
  providers: [ConnectorsService, ActionsService, SyncPollerService, SecurityService],
  exports: [ConnectorsService, ActionsService, SyncPollerService],
})
export class ConnectorsModule {}
