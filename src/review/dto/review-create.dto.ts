import { IsOptional, IsNotEmpty, IsString, IsNumber, Min, Max, IsUUID } from 'class-validator';

export class ReviewCreateDto {
    @IsString()
    @IsOptional()
    readonly text: string;

    @IsNumber()
    @Min(1)
    @Max(5)
    @IsNotEmpty()
    readonly stars: number;

    @IsUUID()
    @IsNotEmpty()
    readonly clientId: string;
}
