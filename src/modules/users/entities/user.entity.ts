import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UserEntity {
  @ApiProperty({
    example: 1,
    description: 'User unique identifier',
  })
  id: number;

  @ApiProperty({
    example: '+998901234567',
    description: 'User phone number (unique)',
  })
  phone: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'User full name',
  })
  fullName: string;

  @ApiProperty({
    enum: UserRole,
    default: UserRole.STUDENT,
    description: 'User role: ADMIN, MENTOR, ASSISTANT, or STUDENT',
  })
  role: UserRole;

  @ApiProperty({
    example: null,
    description: 'User profile image URL (optional)',
    nullable: true,
  })
  image?: string | null;

  @ApiProperty({
    example: true,
    description: 'Phone verification status',
  })
  isVerified: boolean;

  @ApiProperty({
    example: '2024-01-18T10:00:00Z',
    description: 'Account creation timestamp',
  })
  createdAt: Date;
}
