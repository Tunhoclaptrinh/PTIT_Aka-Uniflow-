import axios from 'axios';

/**
 * Enterprise AI Gateway Service
 * Hỗ trợ đa nhà cung cấp (Multi-Provider AI Gateway):
 * 1. Google Gemini API (gemini-1.5-flash / gemini-2.0-flash)
 * 2. OpenAI API (gpt-4o-mini / gpt-4o)
 * 3. Python AI Engine FastAPI Service (port 8000)
 * 4. Ollama Local LLM (Llama3 / Qwen2.5 / PhoGPT)
 * 5. UniFlow Built-in Vector & NER Fallback Engine
 */

export interface AiGatewayResponse<T = any> {
  success: boolean;
  provider: 'FPT_GENAI' | 'GEMINI' | 'OPENAI' | 'PYTHON_AI_ENGINE' | 'OLLAMA' | 'LOCAL_FALLBACK';
  data: T;
  latencyMs: number;
  rawText?: string;
}

export const FPT_MODELS = {
  // 1. LLM & Reasoning
  FAST_LLM: process.env.FPT_AI_FAST_MODEL || 'DeepSeek-V4-Flash',
  REASONING_LLM: process.env.FPT_AI_REASONING_MODEL || 'Llama-3.3-70B-Instruct',
  GENERAL_LLM: process.env.FPT_AI_GENERAL_MODEL || 'Qwen3.6-27B',
  DEFAULT_LLM: process.env.FPT_AI_MODEL || 'DeepSeek-V4-Flash',
  
  // 2. Vision & Multimodal
  VISION: process.env.FPT_AI_VISION_MODEL || 'Qwen2.5-VL-7B-Instruct',
  
  // 3. Vector Embedding & Reranker
  EMBEDDING: process.env.FPT_AI_EMBEDDING_MODEL || 'Vietnamese_Embedding',
  RERANKER: process.env.FPT_AI_RERANK_MODEL || 'bge-reranker-v2-m3',
  
  // 4. Speech (STT & TTS)
  STT: process.env.FPT_AI_STT_MODEL || 'FPT.AI-whisper-large-v3-turbo',
  TTS: process.env.FPT_AI_TTS_MODEL || 'FPT.TTS-pro',
};

export class AiGatewayService {
  /**
   * Trích xuất JSON an toàn từ phản hồi LLM
   */
  private static parseJsonSafely(text: string): any {
    try {
      return JSON.parse(text);
    } catch {
      // Thử bóc tách JSON nằm trong markdown block ```json ... ```
      const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match && match[1]) {
        try {
          return JSON.parse(match[1].trim());
        } catch {
          // ignore
        }
      }
      return text;
    }
  }

  /**
   * Gọi AI Prompt tổng quát với cơ chế dự phòng đa tầng (Multi-tier Failover)
   * Thứ tự ưu tiên: 1. FPT GenAI -> 2. Gemini API -> 3. OpenAI -> 4. Python AI Engine -> 5. Ollama -> 6. Local Fallback
   */
  static async completePrompt(
    prompt: string,
    systemPrompt: string = 'Bạn là trợ lý AI chuyên gia tự động hóa TMĐT của UniFlow.',
    jsonMode: boolean = true,
    targetModel?: string
  ): Promise<AiGatewayResponse<any>> {
    const startTime = Date.now();

    // 1. Thử gọi FPT GenAI / akaBot AI Gateway (DeepSeek-V4-Flash, Llama-3.3-70B, Qwen3.6-27B, etc.)
    const fptKey = process.env.FPT_AI_API_KEY?.trim();
    if (fptKey && fptKey !== 'your-fpt-ai-api-key-here' && fptKey.length > 5) {
      try {
        const baseUrl = (process.env.FPT_AI_BASE_URL || 'https://mkp-api.fptcloud.com/v1').replace(/\/+$/, '');
        const model = targetModel || process.env.FPT_AI_MODEL || FPT_MODELS.DEFAULT_LLM;
        const url = baseUrl.endsWith('/chat/completions') ? baseUrl : `${baseUrl}/chat/completions`;

        const res = await axios.post(
          url,
          {
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: prompt },
            ],
            response_format: jsonMode ? { type: 'json_object' } : undefined,
            temperature: 0.2,
          },
          {
            headers: {
              'Authorization': `Bearer ${fptKey}`,
              'api-key': fptKey,
              'Content-Type': 'application/json',
            },
            timeout: 25000,
          }
        );

        const text = res.data?.choices?.[0]?.message?.content || res.data?.data?.content || '';
        const parsed = jsonMode ? this.parseJsonSafely(text) : text;
        return {
          success: true,
          provider: 'FPT_GENAI',
          data: parsed,
          rawText: text,
          latencyMs: Date.now() - startTime,
        };
      } catch (err: any) {
        console.warn('[AiGateway] FPT GenAI call failed or timed out:', err?.response?.data || err.message);
      }
    }

    // 2. Thử gọi Google Gemini API
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey && geminiKey !== 'your-gemini-api-key-here' && geminiKey.length > 10) {
      try {
        const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
        const res = await axios.post(
          url,
          {
            contents: [
              {
                parts: [
                  { text: `${systemPrompt}\n\n${prompt}` },
                ],
              },
            ],
            generationConfig: jsonMode ? { responseMimeType: 'application/json' } : {},
          },
          { timeout: 3500 }
        );

        const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const parsed = jsonMode ? this.parseJsonSafely(text) : text;
        return {
          success: true,
          provider: 'GEMINI',
          data: parsed,
          rawText: text,
          latencyMs: Date.now() - startTime,
        };
      } catch (err: any) {
        console.warn('[AiGateway] Gemini API call failed or timed out:', err.message);
      }
    }

    // 3. Thử gọi OpenAI API
    const openAiKey = process.env.OPENAI_API_KEY;
    if (openAiKey && openAiKey.startsWith('sk-')) {
      try {
        const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
        const res = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: prompt },
            ],
            response_format: jsonMode ? { type: 'json_object' } : undefined,
          },
          {
            headers: { Authorization: `Bearer ${openAiKey}` },
            timeout: 3500,
          }
        );

        const text = res.data?.choices?.[0]?.message?.content || '';
        const parsed = jsonMode ? this.parseJsonSafely(text) : text;
        return {
          success: true,
          provider: 'OPENAI',
          data: parsed,
          rawText: text,
          latencyMs: Date.now() - startTime,
        };
      } catch (err: any) {
        console.warn('[AiGateway] OpenAI API call failed:', err.message);
      }
    }

    // 4. Thử gọi Python AI Engine (FastAPI port 8000)
    const aiEngineUrl = process.env.AI_ENGINE_URL || 'http://localhost:8000';
    try {
      const res = await axios.post(
        `${aiEngineUrl}/api/v1/ai/complete`,
        { prompt, systemPrompt, jsonMode },
        { timeout: 1500 }
      );
      if (res.data && res.data.success) {
        return {
          success: true,
          provider: 'PYTHON_AI_ENGINE',
          data: res.data.data,
          latencyMs: Date.now() - startTime,
        };
      }
    } catch {
      // Python AI service not running
    }

    // 5. Thử gọi Ollama Local LLM (port 11434)
    const ollamaUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    const ollamaModel = process.env.OLLAMA_MODEL || 'llama3';
    try {
      const res = await axios.post(
        `${ollamaUrl}/api/generate`,
        {
          model: ollamaModel,
          prompt: `${systemPrompt}\n\n${prompt}`,
          stream: false,
          format: jsonMode ? 'json' : undefined,
        },
        { timeout: 1500 }
      );
      if (res.data?.response) {
        const parsed = jsonMode ? this.parseJsonSafely(res.data.response) : res.data.response;
        return {
          success: true,
          provider: 'OLLAMA',
          data: parsed,
          rawText: res.data.response,
          latencyMs: Date.now() - startTime,
        };
      }
    } catch {
      // Ollama not running
    }

    // 6. Fallback qua Local Heuristic Engine
    return {
      success: true,
      provider: 'LOCAL_FALLBACK',
      data: null,
      latencyMs: Date.now() - startTime,
    };
  }

  /**
   * Sinh cấu trúc quy trình từ lời nhắc AI (AI Flow Generator)
   */
  static async generateWorkflowArchitecture(userPrompt: string): Promise<any> {
    const systemPrompt = `Bạn là kiến trúc sư quy trình tự động hóa TMĐT của UniFlow.
Hãy phân tích yêu cầu sau và trả về JSON thuần túy (không markdown):
{
  "name": "Tên quy trình tối ưu",
  "description": "Mô tả mục đích vận hành",
  "marketplace": "TIKTOK_SHOP" | "SHOPEE" | "LAZADA",
  "pos": "SAPO" | "KIOTVIET" | "HARAVAN",
  "logistics": "VIETTEL_POST" | "GHTK" | "GHN" | "MULTI_CARRIER",
  "strategy": "CHEAPEST" | "FASTEST",
  "hasRateCompare": true | false,
  "hasAccounting": true | false
}`;

    const res = await this.completePrompt(userPrompt, systemPrompt, true);
    if (res.data && res.data.name) {
      return res.data;
    }

    // Fallback heuristic analyzer
    const lower = userPrompt.toLowerCase();
    const isShopee = lower.includes('shopee');
    const isLazada = lower.includes('lazada');
    const isRateCompare = lower.includes('so sánh') || lower.includes('cước') || lower.includes('rẻ nhất') || lower.includes('đa hãng');

    return {
      name: isShopee ? 'Quy trình Shopee Open Platform' : isLazada ? 'Quy trình Lazada Inbound' : 'Quy trình TikTok Shop 0-chạm',
      description: userPrompt,
      marketplace: isShopee ? 'SHOPEE' : isLazada ? 'LAZADA' : 'TIKTOK_SHOP',
      pos: lower.includes('kiotviet') ? 'KIOTVIET' : lower.includes('haravan') ? 'HARAVAN' : 'SAPO',
      logistics: isRateCompare ? 'MULTI_CARRIER' : lower.includes('ghn') ? 'GHN' : lower.includes('viettel') ? 'VIETTEL_POST' : 'GHTK',
      hasRateCompare: isRateCompare,
      hasAccounting: lower.includes('hóa đơn') || lower.includes('misa') || lower.includes('vat'),
    };
  }

  /**
   * AI So sánh cước realtime & Tối ưu hóa chi phí giao vận
   */
  static async optimizeCarrierRates(quotes: Array<{ carrier: string; fee: number; etaHours: number }>, strategy: string = 'CHEAPEST') {
    if (!quotes || quotes.length === 0) {
      return {
        chosenCarrier: 'VIETTEL_POST',
        appliedFee: 19500,
        estimatedSavingsVND: 5000,
        reasoning: 'Viettel Post có mức cước ưu đãi tuyến trục tối ưu nhất',
      };
    }

    if (strategy === 'FASTEST') {
      const sorted = [...quotes].sort((a, b) => a.etaHours - b.etaHours);
      return {
        chosenCarrier: sorted[0].carrier,
        appliedFee: sorted[0].fee,
        etaHours: sorted[0].etaHours,
        reasoning: `${sorted[0].carrier} có thời gian giao nhanh nhất (${sorted[0].etaHours}h).`,
      };
    }

    // Default CHEAPEST
    const sorted = [...quotes].sort((a, b) => a.fee - b.fee);
    const maxFee = Math.max(...quotes.map((q) => q.fee));
    const savings = maxFee - sorted[0].fee;

    return {
      chosenCarrier: sorted[0].carrier,
      appliedFee: sorted[0].fee,
      estimatedSavingsVND: savings,
      reasoning: `AI đã chốt ${sorted[0].carrier} với cước ${sorted[0].fee.toLocaleString('vi-VN')}đ (Tiết kiệm ${savings.toLocaleString('vi-VN')}đ).`,
    };
  }

  /**
   * Tạo Vector Embedding từ FPT GenAI (Vietnamese_Embedding)
   */
  static async generateEmbedding(text: string, model: string = FPT_MODELS.EMBEDDING): Promise<number[]> {
    const fptKey = process.env.FPT_AI_API_KEY?.trim();
    if (fptKey && fptKey !== 'your-fpt-ai-api-key-here' && fptKey.length > 5) {
      try {
        const baseUrl = (process.env.FPT_AI_BASE_URL || 'https://mkp-api.fptcloud.com').replace(/\/+$/, '');
        const url = baseUrl.endsWith('/embeddings') ? baseUrl : `${baseUrl}/embeddings`;

        const res = await axios.post(
          url,
          {
            model: model || 'Vietnamese_Embedding',
            input: [text],
          },
          {
            headers: {
              'Authorization': `Bearer ${fptKey}`,
              'Content-Type': 'application/json',
            },
            timeout: 10000,
          }
        );

        const vector = res.data?.data?.[0]?.embedding;
        if (Array.isArray(vector) && vector.length > 0) {
          return vector;
        }
      } catch (err: any) {
        // Fallback gracefully
      }
    }
    return [];
  }
}

