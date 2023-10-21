import { IsNotEmpty } from "class-validator";

export class CreateArticleDto {

    @IsNotEmpty()
    readonly purchase_id: number;
    
    @IsNotEmpty()
    readonly title: string;

    @IsNotEmpty()
    readonly description: string;

    @IsNotEmpty()
    readonly price: number;

    @IsNotEmpty()
    readonly images_url: string[];
    
}