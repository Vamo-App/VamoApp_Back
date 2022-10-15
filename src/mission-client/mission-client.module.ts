import { Module } from '@nestjs/common';
import { MissionClientService } from './mission-client.service';
import { MissionClientController } from './mission-client.controller';

@Module({
  providers: [MissionClientService],
  controllers: [MissionClientController]
})
export class MissionClientModule {}
