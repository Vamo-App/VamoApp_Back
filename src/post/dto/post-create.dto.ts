import { IsOptional, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class PostCreateDto {
    @IsString()
    @IsOptional()
    readonly description: string;

    @IsUrl()
    @IsNotEmpty()
    readonly picture: string;

    @IsString()
    @IsNotEmpty()
    readonly placeId: string;
}
