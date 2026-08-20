import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  private isConnected = false;
  private memoryCache = new Map<string, { value: any; expiresAt: number }>();

  async onModuleInit() {
    const host = process.env.REDIS_HOST?.trim();
    const port = parseInt(process.env.REDIS_PORT || '6379', 10);
    const password = process.env.REDIS_PASSWORD || undefined;

    if (!host || /^(xxxx(?:\.upstash\.io)?|your[-_]?redis|localhost)$/i.test(host)) {
      this.logger.warn('⚠️ [Redis Offline] REDIS_HOST chưa được cấu hình. Kích hoạt chế độ In-Memory Idempotency & Cache fallback.');
      return;
    }

    try {
      this.client = new Redis({
        host,
        port,
        password,
        connectTimeout: 2500,
        maxRetriesPerRequest: 1,
        retryStrategy: (times) => {
          if (times > 3) return null; // Dừng retry sau 3 lần và dùng fallback in-memory
          return Math.min(times * 1000, 3000);
        },
        lazyConnect: true,
      });

      // ioredis emits connection errors asynchronously; handle them so a failed
      // optional dependency does not become an unhandled process error.
      this.client.on('error', () => undefined);

      await this.client.connect();
      this.isConnected = true;
      this.logger.log(`⚡ [Redis Connected] Đã kết nối thành công tới Redis (${host}:${port})`);
    } catch (err: any) {
      this.isConnected = false;
      this.logger.warn(`⚠️ [Redis Offline] Không thể kết nối tới Redis (${host}:${port}): ${err.message}. Kích hoạt chế độ In-Memory Idempotency & Cache fallback.`);
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      try {
        await this.client.quit();
      } catch {
        // Ignore on shutdown
      }
    }
  }

  /**
   * Kiểm tra và thiết lập Idempotency Key chống trùng lặp Webhook đơn hàng 24h
   * @returns { isDuplicate: boolean } - True nếu đơn hàng đã được xử lý trong vòng 24h trước đó
   */
  async checkAndSetIdempotency(key: string, ttlSeconds: number = 86400): Promise<{ isDuplicate: boolean }> {
    const fullKey = `idemp:${key}`;

    if (this.isConnected && this.client) {
      try {
        // Sử dụng lệnh SET với NX (Not Exists) và EX (TTL Seconds) của Redis
        const result = await this.client.set(fullKey, 'PROCESSED', 'EX', ttlSeconds, 'NX');
        return { isDuplicate: result === null };
      } catch (err: any) {
        this.logger.warn(`Lỗi khi truy vấn Redis Idempotency: ${err.message}`);
      }
    }

    // Fallback In-Memory
    const now = Date.now();
    const existing = this.memoryCache.get(fullKey);
    if (existing && existing.expiresAt > now) {
      return { isDuplicate: true };
    }

    this.memoryCache.set(fullKey, {
      value: 'PROCESSED',
      expiresAt: now + ttlSeconds * 1000,
    });
    return { isDuplicate: false };
  }

  /**
   * Lấy giá trị cache
   */
  async get<T = any>(key: string): Promise<T | null> {
    if (this.isConnected && this.client) {
      try {
        const val = await this.client.get(key);
        return val ? JSON.parse(val) : null;
      } catch {
        // Fallback
      }
    }

    const item = this.memoryCache.get(key);
    if (item && item.expiresAt > Date.now()) {
      return item.value as T;
    }
    return null;
  }

  /**
   * Lưu giá trị cache
   */
  async set(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
    if (this.isConnected && this.client) {
      try {
        await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
        return;
      } catch {
        // Fallback
      }
    }

    this.memoryCache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  /**
   * Xóa key cache
   */
  async del(key: string): Promise<void> {
    if (this.isConnected && this.client) {
      try {
        await this.client.del(key);
      } catch {
        // Fallback
      }
    }
    this.memoryCache.delete(key);
  }

  /**
   * Kiểm tra trạng thái Redis cluster / server
   */
  async isHealthy(): Promise<boolean> {
    if (!this.isConnected || !this.client) return false;
    try {
      const pong = await this.client.ping();
      return pong === 'PONG';
    } catch {
      return false;
    }
  }
}
