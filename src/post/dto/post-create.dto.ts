import { IsOptional, IsNotEmpty, IsString, IsUrl, IsUUID } from 'class-validator';

export class PostCreateDto {
    @IsString()
    @IsOptional()
    readonly description: string;

    @IsUrl()
    @IsNotEmpty()
    readonly picture: string;

    @IsUUID()
    @IsNotEmpty()
    readonly placeId: string;
}
