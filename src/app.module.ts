import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from './client/client.module';
import { WeightModule } from './weight/weight.module';
import { TagModule } from './tag/tag.module';
import { RankModule } from './rank/rank.module';
import { MissionClientModule } from './mission-client/mission-client.module';
import { MissionModule } from './mission/mission.module';
import { BusinessModule } from './business/business.module';
import { PostModule } from './post/post.module';
import { PlaceModule } from './place/place.module';
import { ReviewModule } from './review/review.module';
import { EventModule } from './event/event.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    ClientModule, 
    WeightModule, 
    TagModule, 
    RankModule, 
    MissionClientModule, 
    MissionModule, 
    BusinessModule, PostModule, 
    PlaceModule, 
    ReviewModule, 
    EventModule, 
    MediaModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      database: process.env.DATABASE_NAME,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      entities: [__dirname + '/**/*.entity.{js,ts}'],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
      migrations: [__dirname + '/migrations/*.{js,ts}'],
      migrationsRun: true
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
