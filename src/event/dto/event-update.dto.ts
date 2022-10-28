import { IsDateString, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class EventUpdateDto {
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsString()
    @IsNotEmpty()
    readonly description: string;

    @IsString()
    @IsNotEmpty()
    readonly type: string;

    @IsDateString()
    @IsNotEmpty()
    readonly startDate: string;

    @IsDateString()
    @IsNotEmpty()
    readonly endDate: string;

    @IsUrl()
    @IsNotEmpty()
    readonly url: string;
}