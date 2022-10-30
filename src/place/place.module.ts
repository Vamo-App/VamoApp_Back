import { Module } from '@nestjs/common';
import { PlaceService } from './place.service';
import { PlaceController } from './place.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place } from './place.entity';
import { Tag } from '../tag/tag.entity';
import { Client } from '../client/client.entity';
import { Business } from '../business/business.entity';
import { Review } from '../review/review.entity';
import { Event } from '../event/event.entity';
import { Media } from '../media/media.entity';
import { LogModule } from '../log/log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Place, Tag, Client, Business, Review, Event, Media]),
    LogModule
  ],
  providers: [PlaceService],
  controllers: [PlaceController]
})
export class PlaceModule {}
