import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { SaleService } from './sale.service';
import { CreateSaleDto, UpdateSoldedPriceDto } from './dto';

@Controller('api/sale')
export class SaleController {
    constructor(private readonly saleService: SaleService) { }

    @Get('get/all')
    getAllSales() {
        return this.saleService.getAllSales();
    }

    @Get('get/:id')
    getSaleById(@Param('id') id: string) {
        return this.saleService.getSaleById(Number(id));
    }

    @Post('create')
    createSale(@Body() sale: CreateSaleDto) {
        return this.saleService.createSale(sale);
    }

    @Put('update/solded_price/:id')
    updateSoldedPrice(@Param('id') id: string, @Body() dto: UpdateSoldedPriceDto) {
        return this.saleService.updateSoldedPrice(Number(id), dto.solded_price);
    }

    @Delete('delete/:id')
    deleteSale(@Param('id') id: string) {
        return this.saleService.deleteSale(Number(id));
    }

}