import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../infrastructure/prisma/prisma.service';
import type { AuthenticatedUser } from '../shared/authenticated-user';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly jwtExpiresInSeconds: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    config: ConfigService,
  ) {
    this.jwtExpiresInSeconds = Number(config.get<string>('JWT_EXPIRES_IN_SECONDS', '3600'));
  }

  async register(dto: RegisterDto): Promise<{ accessToken: string; user: AuthenticatedUser }> {
    const email = dto.email.trim().toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('El correo ya está registrado.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({ data: { email, passwordHash } });
    return this.withToken({ id: user.id, email: user.email });
  }

  async login(dto: LoginDto): Promise<{ accessToken: string; user: AuthenticatedUser }> {
    const email = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email } });
    const valid = user ? await bcrypt.compare(dto.password, user.passwordHash) : false;
    if (!user || !valid) {
      throw new UnauthorizedException('Correo o contraseña inválidos.');
    }

    return this.withToken({ id: user.id, email: user.email });
  }

  private withToken(user: AuthenticatedUser): { accessToken: string; user: AuthenticatedUser } {
    const accessToken = this.jwt.sign(
      { sub: user.id, email: user.email },
      { expiresIn: this.jwtExpiresInSeconds },
    );
    return { accessToken, user };
  }
}
