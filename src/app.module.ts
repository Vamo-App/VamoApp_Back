import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from './client/client.module';
import { WeightModule } from './weight/weight.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'vamo',
      entities: [__dirname + '/**/*.entity.{js,ts}'],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    ClientModule, 
    WeightModule, 
    TagModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
