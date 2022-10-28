import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { MediaType } from '../../shared/enums/media-type.enum';

export class MediaCreateDto {
    @IsString()
    @IsNotEmpty()
    readonly url: string;

    @IsEnum(MediaType)
    @IsNotEmpty()
    readonly type: MediaType;
}
