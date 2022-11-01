import { Module } from '@nestjs/common';
import { MissionService } from './mission.service';
import { MissionController } from './mission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mission } from './mission.entity';
import { MissionClient } from '../mission-client/mission-client.entity';
import { Client } from '../client/client.entity';
import { Place } from '../place/place.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mission, MissionClient, Client, Place])],
  providers: [MissionService],
  controllers: [MissionController]
})
export class MissionModule {}
