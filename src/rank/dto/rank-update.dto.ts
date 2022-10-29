import { IsOptional, IsString, IsNumber } from 'class-validator';

export class RankUpdateDto {
    @IsString()
    @IsOptional()
    readonly name: string;

    @IsNumber()
    @IsOptional()
    readonly xpNext: number;
}
