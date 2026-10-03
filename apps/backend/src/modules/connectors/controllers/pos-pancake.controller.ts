/**
 * Pancake POS Modular Architecture Re-export Barrel & Compatibility Layer
 * All 11 Pancake POS modules are implemented under ./pancake/
 */
export * from './pancake';

import {
  PancakeOrdersController,
  PancakeChannelsController,
  PancakeInventoryController,
  PancakeSystemController,
} from './pancake';

// Backward compatibility aliases for existing references
export const PancakeConversationsController = PancakeChannelsController;
export const PancakeWebhooksController = PancakeSystemController;
export const PosPancakeController = PancakeOrdersController;
