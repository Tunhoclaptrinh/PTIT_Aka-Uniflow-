import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly jwtSecret: string;

  constructor(private configService: ConfigService) {
    this.jwtSecret =
      this.configService.get<string>('JWT_SECRET') ||
      process.env.JWT_SECRET ||
      'uniflow_ai_jwt_secret_key_ptit_aka_2026';
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Không tìm thấy Bearer Token hợp lệ');
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      request.user = decoded;
      return true;
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }
      throw new UnauthorizedException('Token xác thực không hợp lệ');
    }
  }
}
