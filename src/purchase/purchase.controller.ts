import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseDto } from './dto';

@Controller('api/purchase')
export class PurchaseController {
    constructor(private readonly purchaseService: PurchaseService) { }

    @Get('get/all')
    getAllPurchases() {
        return this.purchaseService.getAllPurchases();
    }

    @Get('get/:id')
    getPurchaseById(@Param('id') id: string) {
        return this.purchaseService.getPurchaseById(Number(id));
    }

    @Post('create')
    createPurchase(@Body() purchase: CreatePurchaseDto) {
        return this.purchaseService.createPurchase(purchase);
    }

    @Put('update/:id')
    updatePurchase(@Param('id') id: string, @Body() purchase: CreatePurchaseDto) {
        return this.purchaseService.updatePurchase(Number(id), purchase);
    }

    @Delete('delete/:id')
    deletePurchase(@Param('id') id: string) {
        return this.purchaseService.deletePurchase(Number(id));
    }

}
