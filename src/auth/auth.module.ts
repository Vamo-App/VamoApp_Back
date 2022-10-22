import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { VamoUserService } from '../vamo-user/vamo-user.service';
import constants from '../shared/security/constants';
import { VamoUserModule } from '../vamo-user/vamo-user.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
   imports: [
       VamoUserModule,
       PassportModule,
       JwtModule.register({
         secret: process.env.JWT_SECRET,
         signOptions: { expiresIn: constants.JWT_EXPIRES_IN },
       })
     ],
   providers: [AuthService, VamoUserService, JwtService, LocalStrategy, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
