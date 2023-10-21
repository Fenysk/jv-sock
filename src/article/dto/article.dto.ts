import { IsNotEmpty } from "class-validator";

export class CreateArticleDto {

    @IsNotEmpty()
    readonly game_id: number;

    @IsNotEmpty()
    readonly purchased_price: number;

    @IsNotEmpty()
    readonly estimated_price: number;

    @IsNotEmpty()
    readonly origin: string;

    @IsNotEmpty()
    readonly state: string;

    @IsNotEmpty()
    readonly content: string[];
    
}