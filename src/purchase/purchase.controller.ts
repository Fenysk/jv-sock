import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseDto } from './dto';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { GetUser, Roles } from 'src/auth/decorator';
import { Role } from 'src/auth/enums/role.enum';

@UseGuards(JwtGuard, RolesGuard)
@Controller('api/purchase')
export class PurchaseController {
    constructor(private readonly purchaseService: PurchaseService) { }

    @Roles(Role.ADMIN)
    @Get('get/all')
    getAllPurchases(@Query('name') name?: string) {
        return this.purchaseService.getAllPurchases(name);
    }

    @Roles(Role.SALLER)
    @Get('get/mine')
    getMyPurchases(
        @GetUser('id') user_id: number,
        @Query('name') name?: string
    ) {
        return this.purchaseService.getMyPurchases(user_id, name);
    }

    @Roles(Role.SALLER)
    @Get('get/:id')
    getPurchaseById(
        @GetUser('id') user_id: number,
        @Param('id') id: string
    ) {
        return this.purchaseService.getPurchaseById(user_id, Number(id));
    }

    @Roles(Role.SALLER)
    @Post('create')
    createPurchase(
        @GetUser('id') user_id: number,
        @Body() purchase: CreatePurchaseDto
    ) {
        return this.purchaseService.createPurchase(user_id, purchase);
    }

    @Roles(Role.SALLER)
    @Put('update/:id')
    updatePurchase(
        @GetUser('id') user_id: number,
        @Param('id') purchase_id: string,
        @Body() data: any
    ) {
        return this.purchaseService.updatePurchase(user_id, Number(purchase_id), data);
    }

    @Roles(Role.SALLER)
    @Delete('delete/:id')
    deletePurchase(
        @GetUser('id') user_id: number,
        @Param('id') id: string
    ) {
        return this.purchaseService.deletePurchase(user_id, Number(id));
    }

}
