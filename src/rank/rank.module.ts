import { Module } from '@nestjs/common';
import { RankService } from './rank.service';
import { RankController } from './rank.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rank } from './rank.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rank])],
  providers: [RankService],
  controllers: [RankController]
})
export class RankModule {}
