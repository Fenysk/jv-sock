import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { PurchaseService } from 'src/purchase/purchase.service';

@Injectable()
export class SaleService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly purchaseService: PurchaseService,
    ) { }

    async getAllSales() {
        let sales = await this.prismaService.sale.findMany({
            include: {
                Purchase: {
                    include: {
                        Game: true
                    }
                }
            }
        });

        if (!sales.length) {
            throw new NotFoundException('No sales found');
        }

        return sales;
    }

    async getMySales(id: number) {
        let sales = await this.prismaService.sale.findMany({
            where: { user_id: id },
            include: {
                Purchase: {
                    include: {
                        Game: true
                    }
                }
            }
        });

        if (!sales.length) {
            throw new NotFoundException('No sales found');
        }

        return sales;
    }

    async getSaleById(user_id: number, id: number) {
        let sale = await this.prismaService.sale.findUnique({
            where: { id },
            include: {
                Purchase: {
                    include: {
                        Game: true
                    }
                }
            }
        });

        if (!sale) {
            throw new NotFoundException('No sale found');
        }

        if (sale.user_id !== user_id) {
            throw new NotFoundException('You are not allowed to see this sale');
        }

        return sale;
    }

    async createSale(user_id: number, data: any) {

        const purchase = await this.purchaseService.getPurchaseById(user_id, data.purchase_id);

        if (!purchase) {
            throw new NotFoundException('No purchase found');
        }

        let newSale: any;

        try {
            newSale = await this.prismaService.sale.create({
                data: {
                    user_id,
                    ...data
                }
            });
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new NotFoundException('This sale already exists');
                }
            }
        }

        if (!newSale) {
            throw new NotFoundException('No purchase found');
        }

        return newSale;
    }

    async updateSoldedPrice(user_id: number, id: number, solded_price: number) {

        let updatedSale: any;

        try {
            updatedSale = await this.prismaService.sale.update({
                where: { id, user_id },
                data: { solded_price }
            });

            return updatedSale;
        } catch (error) {

            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new NotFoundException('This sale already exists');
                } else if (error.code === 'P2003') {
                    throw new ForbiddenException(`${error.meta.field_name} not found`);
                } else if (error.code === 'P2025') {
                    throw new ForbiddenException('You are not allowed to update this sale');
                }
            }

            throw new Error('Sale not updated');
        }
    }

    async deleteSale(user_id: number, id: number) {

        let sale = await this.prismaService.sale.findUnique({
            where: { id }
        });

        if (!sale) {
            throw new NotFoundException('No sale found');
        }

        if (sale.user_id !== user_id) {
            throw new ForbiddenException('You are not allowed to delete this sale');
        }


        let deletedSale = await this.prismaService.sale.delete({
            where: { id }
        });

        return deletedSale;
    }
}
