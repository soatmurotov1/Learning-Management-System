import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { VerificationModule } from './verification/verification.module';

@Module({
  imports: [UsersModule, VerificationModule]
})
export class ModulesModule {}
