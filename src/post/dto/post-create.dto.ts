import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class PostCreateDto {
    @IsString()
    @IsNotEmpty()
    readonly description: string;

    @IsUrl()
    @IsNotEmpty()
    readonly picture: string;

    @IsString()
    @IsNotEmpty()
    readonly placeId: string;
}
