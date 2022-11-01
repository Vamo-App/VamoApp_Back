import { IsOptional, IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class ReviewCreateDto {
    @IsString()
    @IsOptional()
    readonly text: string;

    @IsNumber()
    @IsNotEmpty()
    readonly stars: number;

    @IsString()
    @IsNotEmpty()
    readonly clientId: string;
}
