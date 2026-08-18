import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument, UserRole } from '../../database/schemas/user.schema';
import { Tenant, TenantDocument } from '../../database/schemas/tenant.schema';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn: string;

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Tenant.name) private tenantModel: Model<TenantDocument>,
    private configService: ConfigService,
  ) {
    this.jwtSecret =
      this.configService.get<string>('JWT_SECRET') ||
      process.env.JWT_SECRET ||
      'uniflow_ai_jwt_secret_key_ptit_aka_2026';
    this.jwtExpiresIn =
      this.configService.get<string>('JWT_EXPIRES_IN') ||
      process.env.JWT_EXPIRES_IN ||
      '7d';
  }

  /**
   * Sinh JSON Web Token (JWT)
   */
  generateToken(user: UserDocument): string {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      tenantId: user.tenantId ? user.tenantId.toString() : null,
    };
    return jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiresIn } as any);
  }

  /**
   * Làm sạch dữ liệu User trước khi trả về Client (loại bỏ mật khẩu)
   */
  sanitizeUser(user: any) {
    const obj = user.toObject ? user.toObject() : { ...user };
    delete obj.password;
    return obj;
  }

  /**
   * Đăng ký tài khoản mới
   */
  async register(dto: RegisterDto) {
    const normalizedEmail = dto.email.trim().toLowerCase();

    // 1. Kiểm tra email đã tồn tại chưa
    const existing = await this.userModel.findOne({ email: normalizedEmail });
    if (existing) {
      throw new BadRequestException('Email này đã được đăng ký trong hệ thống UniFlow');
    }

    // 2. Tạo hoặc liên kết Tenant
    let tenantId: Types.ObjectId | undefined;
    if (dto.tenantName && dto.tenantName.trim()) {
      const subdomain = dto.tenantName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-') + '-' + Date.now().toString().slice(-4);

      const newTenant = await this.tenantModel.create({
        name: dto.tenantName.trim(),
        subdomain,
        planTier: 'GROWTH',
        brandTheme: {
          primaryColor: '#ed1c24',
          secondaryColor: '#fcc20f',
        },
        settings: {
          autoRetryOnFailure: true,
          defaultCarrier: 'GHTK',
          alertChannels: ['WEBSOCKET'],
        },
        isActive: true,
      });
      tenantId = newTenant._id as Types.ObjectId;
    } else {
      // Gán vào Default Tenant nếu có
      const defaultTenant = await this.tenantModel.findOne({ isActive: true });
      if (defaultTenant) {
        tenantId = defaultTenant._id as Types.ObjectId;
      }
    }

    // 3. Băm mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    // 4. Tạo User
    const user = await this.userModel.create({
      email: normalizedEmail,
      password: hashedPassword,
      name: dto.name.trim(),
      phone: dto.phone?.trim() || '',
      role: UserRole.MERCHANT,
      tenantId,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(dto.name.trim())}&background=ed1c24&color=fff&bold=true`,
      isActive: true,
    });

    const token = this.generateToken(user);
    const tenant = tenantId ? await this.tenantModel.findById(tenantId) : null;

    return {
      message: 'Đăng ký tài khoản thành công',
      token,
      user: this.sanitizeUser(user),
      tenant: tenant ? tenant.toObject() : null,
    };
  }

  /**
   * Đăng nhập
   */
  async login(dto: LoginDto) {
    const normalizedEmail = dto.email.trim().toLowerCase();

    // 1. Tìm User theo email
    const user = await this.userModel.findOne({ email: normalizedEmail });
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Tài khoản đã bị tạm khóa. Vui lòng liên hệ quản trị viên.');
    }

    // 2. Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    // 3. Cấp Token và lấy thông tin Tenant
    const token = this.generateToken(user);
    const tenant = user.tenantId ? await this.tenantModel.findById(user.tenantId) : null;

    return {
      message: 'Đăng nhập thành công',
      token,
      user: this.sanitizeUser(user),
      tenant: tenant ? tenant.toObject() : null,
    };
  }

  /**
   * Lấy thông tin tài khoản hiện tại (Get Me)
   */
  async getMe(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('User ID không hợp lệ');
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Không tìm thấy thông tin tài khoản');
    }

    const tenant = user.tenantId ? await this.tenantModel.findById(user.tenantId) : null;

    return {
      user: this.sanitizeUser(user),
      tenant: tenant ? tenant.toObject() : null,
    };
  }
}
