import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SKUMapping, SKUMappingDocument } from '../../database/schemas/sku-mapping.schema';
import { BaseService } from '../../common/services/base.service';
import { performAsyncAiSkuMatch, performRealAiSkuMatch, AiMatchResult } from './sku-ai-matcher.util';

@Injectable()
export class SKUMappingService extends BaseService<SKUMappingDocument> {
  protected searchableFields = [
    'sourceSkuCode',
    'sourceProductName',
    'targetMasterSku',
    'targetProductName',
    'sourcePlatform',
    'targetPosPlatform',
    'sourceVariationText',
  ];

  constructor(
    @InjectModel(SKUMapping.name) private readonly skuMappingModel: Model<SKUMappingDocument>
  ) {
    super(skuMappingModel);
  }

  async findAllMappings(tenantId?: string): Promise<SKUMapping[]> {
    const filter = tenantId ? { tenantId: new Types.ObjectId(tenantId) } : {};
    return this.model.find(filter).sort({ confidenceScore: -1 }).exec();
  }

  async approveMapping(id: string, approverId?: string): Promise<SKUMapping> {
    const mapping = await this.model
      .findByIdAndUpdate(
        id,
        {
          $set: {
            mappingStatus: 'AUTO_APPROVED',
            approvedBy: approverId || 'ADMIN_USER',
          },
        },
        { new: true }
      )
      .exec();

    if (!mapping) {
      throw new NotFoundException(`SKU Mapping #${id} không tìm thấy`);
    }

    return mapping;
  }

  async bulkApprove(ids: string[], approverId?: string) {
    const objectIds = ids.map((id) => new Types.ObjectId(id));
    const result = await this.model.updateMany(
      { _id: { $in: objectIds } },
      {
        $set: {
          mappingStatus: 'AUTO_APPROVED',
          approvedBy: approverId || 'ADMIN_USER',
        },
      }
    );
    return { success: result.modifiedCount };
  }

  async testAIMatch(payload: {
    sourceSku: string;
    sourceName: string;
    targetSku: string;
    targetName: string;
  }): Promise<AiMatchResult> {
    return performAsyncAiSkuMatch(
      payload.sourceSku || '',
      payload.sourceName || '',
      payload.targetSku || '',
      payload.targetName || ''
    );
  }
}
