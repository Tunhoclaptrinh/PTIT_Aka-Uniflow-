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
  PancakeConversationsController,
  PancakeInventoryController,
  PancakeWebhooksController,
} from './controllers/pos-pancake.controller';
import {
  LogisticsGhtkController,
  LogisticsGhnController,
  LogisticsViettelPostController,
} from './controllers/logistics/logistics.controller';
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

// 3. KIOTVIET MODULAR CONTROLLERS (6 Modules)
import {
  KiotVietInvoicesController,
  KiotVietProductsController,
  KiotVietInventoryController,
  KiotVietCustomersController,
  KiotVietBranchesController,
  KiotVietWebhooksController,
} from './controllers/kiotviet';

// 4. HARAVAN OMNICHANNEL MODULAR CONTROLLERS (30 Dedicated Resources)
import {
  HaravanOrdersController,
  HaravanDraftOrdersController,
  HaravanFulfillmentsController,
  HaravanTransactionsController,
  HaravanRefundsController,
  HaravanProductsController,
  HaravanVariantsController,
  HaravanImagesController,
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
  HaravanRedirectsScriptTagsController,
  HaravanWebhooksController,
  HaravanEventsController,
  HaravanShopPropertiesController,
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
  // MISA AMIS CRM (5)
  MisaAmisCrmCustomersController,
  MisaAmisCrmContactsController,
  MisaAmisCrmLeadsController,
  MisaAmisCrmOpportunitiesController,
  MisaAmisCrmQuotationsController,
  // MISA AMIS Accounting (3)
  MisaAmisAccountingVouchersController,
  MisaAmisAccountingProductsController,
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
    // Pancake (4)
    PancakeOrdersController,
    PancakeConversationsController,
    PancakeInventoryController,
    PancakeWebhooksController,

    // Logistics VN (3)
    LogisticsGhtkController,
    LogisticsGhnController,
    LogisticsViettelPostController,
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

    // KiotViet (6)
    KiotVietInvoicesController,
    KiotVietProductsController,
    KiotVietInventoryController,
    KiotVietCustomersController,
    KiotVietBranchesController,
    KiotVietWebhooksController,

    // Haravan Omnichannel (30 Dedicated Resources)
    HaravanOrdersController,
    HaravanDraftOrdersController,
    HaravanFulfillmentsController,
    HaravanTransactionsController,
    HaravanRefundsController,
    HaravanProductsController,
    HaravanVariantsController,
    HaravanImagesController,
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
    HaravanRedirectsScriptTagsController,
    HaravanWebhooksController,
    HaravanEventsController,
    HaravanShopPropertiesController,

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
    MisaAmisCrmCustomersController,
    MisaAmisCrmContactsController,
    MisaAmisCrmLeadsController,
    MisaAmisCrmOpportunitiesController,
    MisaAmisCrmQuotationsController,
    MisaAmisAccountingVouchersController,
    MisaAmisAccountingProductsController,
    MisaAmisAccountingReportsController,
  ],
  providers: [ConnectorsService, ActionsService, SyncPollerService, SecurityService],
  exports: [ConnectorsService, ActionsService, SyncPollerService],
})
export class ConnectorsModule {}
