import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../../client/client.entity';
import { Weight } from '../../weight/weight.entity';
import { Tag } from '../../tag/tag.entity';
import { Place } from '../../place/place.entity';
import { Business } from '../../business/business.entity';
import { Rank } from '../../rank/rank.entity';
import { Media } from '../../media/media.entity';
import { Event as EventEntity } from '../../event/event.entity';
import { Review } from '../../review/review.entity';
import { Mission } from '../../mission/mission.entity';
import { MissionClient } from '../../mission-client/mission-client.entity';
import { Post } from '../../post/post.entity';
import { Log } from '../../log/log.entity';
import * as dotenv from 'dotenv';
dotenv.config();

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,
    database: process.env.DATABASE_NAME + '-test',
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    entities: [__dirname + '/**/*.entity.{js,ts}'],
    dropSchema: true,
    synchronize: true,
    keepConnectionAlive: true
  }),
  TypeOrmModule.forFeature([Client, Weight, Tag, Place, Business, Rank, Media, EventEntity, Review, Mission, MissionClient, Post, Log]),
];
