import { IsNotEmpty } from "class-validator";

export class CreateGameDto {

    @IsNotEmpty()
    readonly image_url: string;

    @IsNotEmpty()
    readonly name: string;

    @IsNotEmpty()
    readonly console: string;

    @IsNotEmpty()
    readonly edition: string;

    @IsNotEmpty()
    readonly region: string;

    @IsNotEmpty()
    readonly released_year: number;

    @IsNotEmpty()
    readonly barcode_data: string;
    
}