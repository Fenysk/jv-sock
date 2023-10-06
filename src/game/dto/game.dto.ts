import { IsNotEmpty } from "class-validator";

export class CreateGameDto {

    @IsNotEmpty()
    readonly image_url: string;
    readonly name: string;
    readonly console: string;
    readonly edition: string;
    readonly region: string;
    readonly released_year: number;
    readonly barcode_data: string;
    
}