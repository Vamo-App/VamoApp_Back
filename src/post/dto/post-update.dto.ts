import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class PostUpdateDto {
    @IsString()
    @IsOptional()
    readonly description: string;

    @IsBoolean()
    @IsOptional()
    readonly visible: boolean;
}
