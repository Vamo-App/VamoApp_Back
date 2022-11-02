import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';

export class ReviewUpdateDto {
    @IsString()
    @IsOptional()
    readonly text: string;

    @IsNumber()
    @Min(1)
    @Max(5)
    @IsOptional()
    readonly stars: number;
}
