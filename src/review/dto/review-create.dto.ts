import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class ReviewCreateDto {
    @IsString()
    @IsNotEmpty()
    readonly text: string;

    @IsNumber()
    @IsNotEmpty()
    readonly stars: number;

    @IsString()
    @IsNotEmpty()
    readonly clientId: string;
}
