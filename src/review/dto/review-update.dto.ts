import { IsOptional, IsString, IsNumber } from 'class-validator';

export class ReviewUpdateDto {
    @IsString()
    @IsOptional()
    readonly text: string;

    @IsNumber()
    @IsOptional()
    readonly stars: number;
}
