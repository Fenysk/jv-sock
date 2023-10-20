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
            throw new NotFoundException('No user purchases found');
        }

        return purchases;
    }

    async getMyPurchases(id: number) {
        const purchases = await this.prismaService.purchase.findMany({
            where: { user_id: id },
            include: {
                Game: true,
                Sale: true
            }
        });

        if (!purchases.length) {
            throw new NotFoundException('No user purchases found');
        }

        return purchases;
    }

    async getPurchaseById(user_id: number, id: number) {
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

        if (purchase.user_id !== user_id) {
            throw new ForbiddenException('You are not allowed to see this purchase');
        }

        return purchase;
    }

    async createPurchase(user_id: number, purchase: any) {

        let newPurchase: any;

        try {
            newPurchase = await this.prismaService.purchase.create({
                data: {
                    user_id,
                    ...purchase
                }
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

    async updatePurchase(user_id: number, id: number, data: any) {

        let updatedPurchase: any;

        try {
            updatedPurchase = await this.prismaService.purchase.update({
                where: {
                    id,
                    user_id
                },
                data: data,
            });

            return updatedPurchase;

        } catch (error) {
            
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException('Purchase not found');
                } else if (error.code === 'P2003') {
                    throw new ForbiddenException(`${error.meta.field_name} not found`);
                }
            }
            
            throw new Error('Purchase not updated');
        }

    }

    async deletePurchase(user_id: number, id: number) {

        let deletedPurchase: any;

        try {
            deletedPurchase = await this.prismaService.purchase.delete({
                where: {
                    id,
                    user_id
                }
            });
        } catch (error) {
            console.log('error code :', error.code);
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException('Purchase not found');
                }
            }
        }

        if (!deletedPurchase) {
            throw new NotFoundException('Purchase not deleted');
        }

        return deletedPurchase;

    }
}