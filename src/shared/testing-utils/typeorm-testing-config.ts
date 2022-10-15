import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../../client/client.entity';
import { Weight } from '../../weight/weight.entity';
import { Tag } from '../../tag/tag.entity';
/*import { Place } from '../../place/place.entity';
import { Business } from '../../business/business.entity';
import { Rank } from '../../rank/rank.entity';
import { Media } from '../../media/media.entity';
import { Event as EventEntity } from '../../event/event.entity';
import { Review } from '../../review/review.entity';
import { Mission } from '../../mission/mission.entity';
import { MissionClient } from '../../mission-client/mission-client.entity';*/

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [Client, Weight, Tag, /*Place, Business, Rank, Media, EventEntity, Review, Mission, MissionClient*/],
    synchronize: true,
    keepConnectionAlive: true
  }),
  TypeOrmModule.forFeature([Client, Weight, Tag, /*Place, Business, Rank, Media, EventEntity, Review, Mission, MissionClient*/]),
];
