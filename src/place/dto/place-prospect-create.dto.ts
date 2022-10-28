import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class PlaceProspectCreateDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsUrl()
    @IsNotEmpty()
    readonly picture: string;

    @IsString()
    @IsNotEmpty()
    readonly address: string;

    @IsString()
    @IsNotEmpty()
    readonly phone: string;

    @IsUrl()
    readonly website: string;

    @IsUrl()
    readonly facebook: string;

    @IsUrl()
    readonly instagram: string;

    @IsUrl()
    readonly tiktok: string;
}
