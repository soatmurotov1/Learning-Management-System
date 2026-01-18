import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { HomeworkModule } from './homework/homework.module';
import { MentorProfileModule } from './mentor_profile/mentor_profile.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    UsersModule,
    HomeworkModule,
    MentorProfileModule,
  ],
  providers: [JwtStrategy],
})
export class ModulesModule {}
