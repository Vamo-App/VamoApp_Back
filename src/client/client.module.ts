import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientController } from './client.controller';
import { Client } from './client.entity';
import { Post } from '../post/post.entity';
import { Weight } from '../weight/weight.entity';
import { Tag } from '../tag/tag.entity';
import { Mission } from '../mission/mission.entity';
import { Place } from '../place/place.entity';
import { MissionClient } from '../mission-client/mission-client.entity';
import { Rank } from '../rank/rank.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Post, Weight, Tag, Mission, Place, MissionClient, Rank])],
  providers: [ClientService],
  controllers: [ClientController]
})
export class ClientModule {}
