import { Min, IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class RankCreateDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    readonly level: number;

    @IsNumber()
    @IsNotEmpty()
    readonly xpNext: number;
}
