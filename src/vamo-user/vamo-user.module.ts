import { Module } from '@nestjs/common';
import { VamoUserService } from './vamo-user.service';
import { VamoUserController } from './vamo-user.controller';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [VamoUserService, AuthService, JwtService],
  controllers: [VamoUserController]
})
export class VamoUserModule {}
