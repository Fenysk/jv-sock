import { IsNotEmpty } from "class-validator";

export class CreatePurchaseDto {

    @IsNotEmpty()
    readonly game_id: number;
    readonly purchased_price: number;
    readonly estimated_price: number;
    readonly origin: string;
    readonly state: string;
    readonly content: string[];
    
}