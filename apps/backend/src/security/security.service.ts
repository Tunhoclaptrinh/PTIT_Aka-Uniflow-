import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class SecurityService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly encryptionKey = Buffer.from(
    process.env.ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
    'hex'
  );

  /**
   * Xác thực chữ ký số HMAC-SHA256 của Webhook TikTok Shop
   */
  verifyTikTokHmac(rawBody: string | Buffer, signatureHeader: string, secret: string): boolean {
    if (!signatureHeader || !secret) return false;

    // Signature có dạng "SHA256=abcdef..." hoặc "abcdef..."
    const cleanSignature = signatureHeader.replace(/^SHA256=/i, '');

    const calculatedSig = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(cleanSignature, 'hex'),
      Buffer.from(calculatedSig, 'hex')
    );
  }

  /**
   * Tính toán chữ ký HMAC-SHA256 gửi sang Shopee Open Platform
   */
  generateShopeeSignature(partnerId: string, apiPath: string, timestamp: number, accessToken: string, shopId: string, partnerKey: string): string {
    const baseString = `${partnerId}${apiPath}${timestamp}${accessToken}${shopId}`;
    return crypto
      .createHmac('sha256', partnerKey)
      .update(baseString)
      .digest('hex');
  }

  /**
   * Mã hóa AES-256-GCM bảo vệ Access Token & Secrets
   */
  encryptCredential(plainText: string): { cipherText: string; iv: string; authTag: string } {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(this.algorithm, this.encryptionKey, iv);

    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag().toString('hex');

    return {
      cipherText: encrypted,
      iv: iv.toString('hex'),
      authTag,
    };
  }

  /**
   * Giải mã AES-256-GCM
   */
  decryptCredential(cipherText: string, ivHex: string, authTagHex: string): string {
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, this.encryptionKey, iv);

    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(cipherText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
