import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Weight } from './weight.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Weight])],
})
export class WeightModule {}
