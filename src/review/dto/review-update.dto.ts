import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class ReviewUpdateDto {
    @IsString()
    @IsNotEmpty()
    readonly text: string;

    @IsNumber()
    @IsNotEmpty()
    readonly stars: number;
}
