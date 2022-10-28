import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class RankCreateDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsNumber()
    @IsNotEmpty()
    readonly level: number;

    @IsNumber()
    @IsNotEmpty()
    readonly xpNext: number;
}
