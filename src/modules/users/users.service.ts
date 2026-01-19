import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RedisService } from 'src/common/redis/redis.service';
import { SmsService } from 'src/common/services/sms.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyDto } from './dto/verify.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { generateOtp } from 'src/common/core/random';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private sms: SmsService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    })
    if (exists && exists.isVerified) {
      throw new HttpException(
        "Telefon raqam allaqachon ro'yxatdan o'tgan",
        HttpStatus.BAD_REQUEST,
      );
    }
    if (exists && !exists.isVerified) {
      const otp = generateOtp()
      const key = `reg_${dto.phone}`
      await this.redis.set(key, otp, 600)
      await this.sms.sendSMS(
        `Fixoo platformasidan ro'yxatdan o'tish uchun tasdiqlash kodi: ${otp}. Kodni hech kimga bermang!`,
        dto.phone
      )
      return {
        message: 'OTP qayta yuborildi. SMS-ni tekshiring',
        userId: exists.id,
        success: true
      }
    }
    if (dto.password.length < 6) {
      throw new HttpException(
        "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
        HttpStatus.BAD_REQUEST
      )
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        phone: dto.phone,
        password: hashedPassword,
        fullName: dto.fullName,
        role: dto.role,
        isVerified: false
      }
    })

    const otp = generateOtp();
    const key = `reg_${dto.phone}`
    await this.redis.set(key, otp, 600)
    await this.sms.sendSMS(
      `Fixoo platformasidan ro'yxatdan o'tish uchun tasdiqlash kodi: ${otp}. Kodni hech kimga bermang!`,
      dto.phone
    )

    return {
      message: "Foydalanuvchi ro'yxatdan o'tdi. OTP SMS orqali yuborildi",
      userId: user.id,
      success: true,
    }
  }
  async verify(dto: VerifyDto) {
    const key = `reg_${dto.phone}`
    const storedOtp = await this.redis.get(key)
    if (!storedOtp || storedOtp !== dto.otp) {
      throw new HttpException(
        "OTP noto'g'ri yoki muddati tugagan",
        HttpStatus.BAD_REQUEST
      )
    }
    const user = await this.prisma.user.findUnique({
      where: { phone: dto.phone }
    })

    if (!user) {
      throw new HttpException('Foydalanuvchi topilmadi', HttpStatus.NOT_FOUND)
    }
    const updatedUser = await this.prisma.user.update({
      where: { phone: dto.phone },
      data: { isVerified: true }
    })
    await this.redis.delete(key)
    return {
      message: 'Telefon muvaffaqiyatli tasdiqlandi',
      userId: updatedUser.id,
      success: true,
    };
  }
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    })
    if (!user) {
      throw new HttpException(
        "Telefon raqam yoki parol noto'g'ri",
        HttpStatus.UNAUTHORIZED
      )
    }
    if (!user.isVerified) {
      throw new HttpException(
        'Telefon raqam tasdiqlanmagan. Iltimos, avval OTP orqali tasdiqlang',
        HttpStatus.FORBIDDEN
      )
    }
    const isMatch = await bcrypt.compare(dto.password, user.password)
    if (!isMatch) {
      throw new HttpException(
        "Telefon raqam yoki parol noto'g'ri",
        HttpStatus.UNAUTHORIZED
      )
    }

    const payload = {
      sub: user.id,
      phone: user.phone,
      role: user.role,
      fullName: user.fullName,
    };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '24h',
    });

    const { password, ...userWithoutPassword } = user;
    return {
      message: 'Muvaffaqiyatli kirish',
      user: userWithoutPassword,
      accessToken,
      success: true
    }
  }
  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phone: true,
        fullName: true,
        role: true,
        image: true,
        isVerified: true,
        createdAt: true,
      },
    });
    if (!user) {
      throw new HttpException('Foydalanuvchi topilmadi', HttpStatus.NOT_FOUND);
    }
    return user
  }
}
