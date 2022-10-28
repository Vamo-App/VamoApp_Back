import { Module } from '@nestjs/common';
import { VamoUserService } from './vamo-user.service';

@Module({
  providers: [VamoUserService],
  exports: [VamoUserService]
})
export class VamoUserModule {}
