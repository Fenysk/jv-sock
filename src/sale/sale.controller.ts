import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { SaleService } from './sale.service';
import { CreateSaleDto, UpdateSoldedPriceDto } from './dto';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { GetUser, Roles } from 'src/auth/decorator';
import { Role } from 'src/auth/enums/role.enum';

@UseGuards(JwtGuard, RolesGuard)
@Controller('api/sale')
export class SaleController {
    constructor(private readonly saleService: SaleService) { }

    @Roles(Role.ADMIN)
    @Get('get/all')
    getAllSales(@Query('name') name?: string) {
        return this.saleService.getAllSales(name);
    }

    @Roles(Role.SALLER)
    @Get('get/mine')
    getMySales(
        @GetUser('id') user_id: number,
        @Query('name') name?: string
    ) {
        return this.saleService.getMySales(user_id, name);
    }

    @Roles(Role.ADMIN)
    @Get('get/:id')
    getSaleById(
        @GetUser('id') user_id: number,
        @Param('id') id: string
    ) {
        return this.saleService.getSaleById(user_id, Number(id));
    }

    @Post('create')
    createSale(
        @GetUser('id') user_id: number,
        @Body() sale: CreateSaleDto
    ) {
        return this.saleService.createSale(user_id, sale);
    }

    @Put('update/solded_price/:id')
    updateSoldedPrice(
        @GetUser('id') user_id: number,
        @Param('id') sale_id: string,
        @Body() dto: UpdateSoldedPriceDto
    ) {
        return this.saleService.updateSoldedPrice(user_id, Number(sale_id), dto.solded_price);
    }

    @Delete('delete/:id')
    deleteSale(
        @GetUser('id') user_id: number,
        @Param('id') id: string
    ) {
        return this.saleService.deleteSale(user_id, Number(id));
    }

}