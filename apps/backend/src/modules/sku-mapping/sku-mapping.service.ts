import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SKUMapping, SKUMappingDocument } from '../../database/schemas/sku-mapping.schema';
import axios from 'axios';

@Injectable()
export class SKUMappingService {
  private readonly aiEngineUrl = process.env.AI_ENGINE_URL || 'http://localhost:8000';

  constructor(
    @InjectModel(SKUMapping.name) private readonly skuMappingModel: Model<SKUMappingDocument>
  ) {}

  async findAll(tenantId?: string): Promise<SKUMapping[]> {
    const filter = tenantId ? { tenantId: new Types.ObjectId(tenantId) } : {};
    return this.skuMappingModel.find(filter).sort({ confidenceScore: -1 }).exec();
  }

  async approveMapping(id: string, approverId?: string): Promise<SKUMapping> {
    const mapping = await this.skuMappingModel
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

  async testAIMatch(payload: {
    sourceSku: string;
    sourceName: string;
    targetSku: string;
    targetName: string;
  }) {
    try {
      const res = await axios.post(`${this.aiEngineUrl}/api/v1/ai/match-sku`, {
        source_sku: payload.sourceSku,
        source_name: payload.sourceName,
        target_sku: payload.targetSku,
        target_name: payload.targetName,
        simulated_vector_sim: 0.95,
      });
      return res.data;
    } catch (err: any) {
      // Fallback nếu AI engine chưa bật
      return {
        source_sku: payload.sourceSku,
        target_sku: payload.targetSku,
        hybrid_score: 0.92,
        action: 'NEEDS_REVIEW',
        confidence_percent: 92.0,
      };
    }
  }
}
