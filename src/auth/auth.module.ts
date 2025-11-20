import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CredentialModule } from 'src/credential/credential.module';

@Module({
  imports: [CredentialModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
