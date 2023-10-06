import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PurchaseService {
    constructor(private readonly prismaService: PrismaService) { }

    async getAllPurchases() {
        const purchases = await this.prismaService.purchase.findMany({
            include: {
                Game: true,
                Sale: true
            }
        });

        if (!purchases.length) {
            throw new NotFoundException('No purchases found');
        }

        return purchases;
    }

    async getPurchaseById(id: number) {
        const purchase = await this.prismaService.purchase.findUnique({
            where: { id },
            include: {
                Game: true,
                Sale: true
            }
        });

        if (!purchase) {
            throw new NotFoundException('No purchase found');
        }

        return purchase;
    }

    async createPurchase(purchase: any) {
        let newPurchase;
        try {
            newPurchase = await this.prismaService.purchase.create({
                data: purchase,
            });
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2003') {
                    throw new ForbiddenException(`${error.meta.field_name} not found`);
                } else {
                    throw new Error('Purchase not created');
                }
            }
        }

        if (!newPurchase) {
            throw new NotFoundException('Cannot create purchase');
        }

        return newPurchase;
    }

    async updatePurchase(id: number, purchase: any) {
        const updatedPurchase = await this.prismaService.purchase.update({
            where: { id },
            data: purchase,
        });

        if (!updatedPurchase) {
            throw new NotFoundException('Cannot update purchase');
        }

        return updatedPurchase;
    }

    async deletePurchase(id: number) {
        const deletedPurchase = await this.prismaService.purchase.delete({
            where: { id },
        });

        if (!deletedPurchase) {
            throw new NotFoundException('Cannot delete purchase');
        }

        return 'Purchase deleted successfully';
    }

}
