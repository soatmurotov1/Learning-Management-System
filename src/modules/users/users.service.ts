import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RedisService } from 'src/common/redis/redis.service';
import { SmsService } from 'src/common/services/sms.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyDto } from './dto/verify.dto';
import { ResetPassword } from './dto/reset-password.dto';
import { RefreshToken } from './dto/refresh_token.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { EVerificationTypes } from 'src/common/types/verification.types';
import { VericationService } from '../verication/verication.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private sms: SmsService,
    private jwtService: JwtService,
    private vericationService: VericationService
  ) {}

  async register(dto: RegisterDto) {
    const key = `${EVerificationTypes.REGISTER}_${dto.phone}`
    const storedOtp = await this.redis.get(key)
    if (!storedOtp || storedOtp !== dto.otp) {
      throw new HttpException(
        "OTP noto'g'ri yoki muddati tugagan",
        HttpStatus.BAD_REQUEST
      )
    }

    const exists = await this.prisma.user.findUnique({
      where: { phone: dto.phone }
    })
    if (exists && exists.isVerified) {
      throw new HttpException(
        "Telefon raqam allaqachon ro'yxatdan o'tgan",
        HttpStatus.BAD_REQUEST
      )
    }

    if (dto.password.length < 6) {
      throw new HttpException(
        "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
        HttpStatus.BAD_REQUEST
      )
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10)

    let user
    if (exists) {
      user = await this.prisma.user.update({
        where: { phone: dto.phone },
        data: {
          password: hashedPassword,
          fullName: dto.fullName,
          image: dto.image,
          isVerified: true
        }
      })
    } else {
      user = await this.prisma.user.create({
        data: {
          phone: dto.phone,
          password: hashedPassword,
          fullName: dto.fullName,
          role: dto.role,
          image: dto.image,
          isVerified: true
        }
      })
    }

    await this.vericationService.deleteOtp(
      EVerificationTypes.REGISTER,
      dto.phone
    )

    return {
      success: true,
      message: "Foydalanuvchi muvaffaqiyatli ro'yxatdan o'tdi",
      userId: user.id
    }
  }

  async verify(dto: VerifyDto) {
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

    await this.vericationService.deleteOtp(
      EVerificationTypes.REGISTER,
      dto.phone
    )

    return {
      success: true,
      message: 'Telefon muvaffaqiyatli tasdiqlandi',
      userId: updatedUser.id
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { phone: dto.phone }
    })
    if (!user) {
      throw new HttpException(
        "Telefon raqam yoki parol noto'g'ri",
        HttpStatus.UNAUTHORIZED
      )
    }
    if (!user.isVerified) {
      throw new HttpException(
        'Telefon raqam tasdiqlanmagan',
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
      fullName: user.fullName

    }
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '24h'
    })

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d'
    })

    const { password, ...userWithoutPassword } = user;
    return {
      success: true,
      message: 'Muvaffaqiyatli kirish',
      user: userWithoutPassword,
      accessToken,
      refreshToken
    }
  }

  async refreshToken(dto: RefreshToken) {
    try {
      const decoded = this.jwtService.verify(dto.token)

      const user = await this.prisma.user.findUnique({
        where: { id: decoded.sub }
      })

      if (!user) {
        throw new HttpException(
          'Foydalanuvchi topilmadi',
          HttpStatus.NOT_FOUND
        )
      }

      const payload = {
        sub: user.id,
        phone: user.phone,
        role: user.role,
        fullName: user.fullName
      }

      const newAccessToken = this.jwtService.sign(payload, {
        expiresIn: '24h'
      })

      const newRefreshToken = this.jwtService.sign(payload, {
        expiresIn: '7d'
      })

      return {
        message: 'Token muvaffaqiyatli yangilandi',
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        success: true
      }
    } catch (error) {
      throw new HttpException(
        "Noto'g'ri yoki muddati tugagan token",
        HttpStatus.UNAUTHORIZED
      )
    }
  }

  async resetPassword(dto: ResetPassword) {
    const user = await this.prisma.user.findUnique({
      where: { phone: dto.phone }
    })

    if (!user) {
      throw new HttpException('Foydalanuvchi topilmadi', HttpStatus.NOT_FOUND)
    }

    if (dto.password.length < 6) {
      throw new HttpException(
        "Parol 6 ta son bo'lishi kerak",
        HttpStatus.BAD_REQUEST
      )
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    await this.prisma.user.update({
      where: { phone: dto.phone },
      data: { password: hashedPassword }
    })

    await this.vericationService.deleteOtp(
      EVerificationTypes.RESET_PASSWORD,
      dto.phone
    )

    return {
      message: "Parol muvaffaqiyatli o'zgartirildi",
      success: true
    }
  }

  async editPhone(userId: number, newPhone: string, otp: string) {
    const key = `${EVerificationTypes.EDIT_PHONE}_${newPhone}`
    const storedOtp = await this.redis.get(key)
    if (!storedOtp || storedOtp !== otp) {
      throw new HttpException(
        "OTP noto'g'ri yoki muddati tugagan",
        HttpStatus.BAD_REQUEST
      )
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new HttpException('Foydalanuvchi topilmadi', HttpStatus.NOT_FOUND)
    }

    const phoneExists = await this.prisma.user.findUnique({
      where: { phone: newPhone }
    })

    if (phoneExists && phoneExists.id !== userId) {
      throw new HttpException(
        "Bu telefon raqam allaqachon ro'yxatdan o'tgan",
        HttpStatus.BAD_REQUEST
      )
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { phone: newPhone }
    })

    await this.vericationService.deleteOtp(
      EVerificationTypes.EDIT_PHONE,
      newPhone
    )
    const { password, ...userWithoutPassword } = updatedUser
    return {
      message: "Telefon raqam muvaffaqiyatli o'zgartirildi",
      user: userWithoutPassword,
      success: true
    }
  }
}
