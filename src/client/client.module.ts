import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientController } from './client.controller';
import { Client } from './client.entity';
import { Post } from '../post/post.entity';
import { Weight } from '../weight/weight.entity';
import { Tag } from '../tag/tag.entity';
import { Mission } from '../mission/mission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Post, Weight, Tag, Mission])],
  providers: [ClientService],
  controllers: [ClientController]
})
export class ClientModule {}
