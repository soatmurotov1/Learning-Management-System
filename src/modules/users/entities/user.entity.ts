import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UserEntity {
  @ApiProperty({ example: 1 })
  id: number

  @ApiProperty({ example: '+998901112233' })
  phone: string

  @ApiProperty({ example: 'string' })
  fullName: string

  @ApiProperty({ enum: UserRole, default: UserRole.STUDENT })
  role: UserRole

  @ApiProperty({ example: null, nullable: true })
  image?: string 

  @ApiProperty({ example: true })
  isVerified: boolean;

  @ApiProperty({ example: '2024-01-11T10:00:00Z' })
  createdAt: Date
}
