import { IsNotEmpty } from "class-validator";

export class CreateSaleDto {

    @IsNotEmpty()
    readonly purchase_id: number;

    @IsNotEmpty()
    readonly solded_price: number;
    
}

export class UpdateSoldedPriceDto {

    @IsNotEmpty()
    readonly solded_price: number;
    
}