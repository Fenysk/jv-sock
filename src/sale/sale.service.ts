import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PurchaseService } from 'src/purchase/purchase.service';

@Injectable()
export class SaleService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly purchaseService: PurchaseService,
    ) { }

    async getAllSales() {
        const sales = await this.prismaService.sale.findMany({});

        if (!sales) {
            throw new NotFoundException('No sales found');
        }

        return sales;
    }

    async getSaleById(id: number) {
        const sale = await this.prismaService.sale.findUnique({
            where: { id: id },
        });

        if (!sale) {
            throw new NotFoundException('Sale not found');
        }

        return sale;
    }

    async createSale(sale) {

        const purchase = await this.purchaseService.getPurchaseById(sale.purchase_id);

        const createdSale = await this.prismaService.sale.create({
            data: {
                ...sale,
                game_id: purchase.game_id,
            }
        });

        return createdSale;
    }

    async updateSoldedPrice(id: number, solded_price: any) {
        
        console.log(solded_price);

        const updatedSale = await this.prismaService.sale.update({
            where: { id: id },
            data: {
                solded_price: solded_price,
            },
        });

        return updatedSale;
    }

    async deleteSale(id: number) {
        const deletedSale = await this.prismaService.sale.delete({
            where: { id: id },
        });

        if (!deletedSale) {
            throw new NotFoundException('Cannot delete sale');
        }

        return 'Sale deleted';
    }
}
