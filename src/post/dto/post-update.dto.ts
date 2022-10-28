import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class PostUpdateDto {
    @IsString()
    @IsNotEmpty()
    readonly description: string;

    @IsBoolean()
    @IsNotEmpty()
    readonly visible: boolean;
}
