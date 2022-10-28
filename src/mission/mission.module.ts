import { Module } from '@nestjs/common';
import { MissionService } from './mission.service';
import { MissionController } from './mission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mission } from './mission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mission])],
  providers: [MissionService],
  controllers: [MissionController]
})
export class MissionModule {}
