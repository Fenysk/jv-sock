import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PurchaseService {
    constructor(private readonly prismaService: PrismaService) { }

    async getAllPurchases(name?: string) {

        const purchases = await this.prismaService.purchase.findMany({
            where: {
                Game: {
                    name: {
                        contains: name,
                        mode: 'insensitive'
                    }
                }
            },
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

    async getMyPurchases(user_id: number, name?: string) {
        const purchases = await this.prismaService.purchase.findMany({
            where: {
                user_id: user_id,
                Game: {
                    name: {
                        contains: name,
                        mode: 'insensitive'
                    }
                }
            },
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

        try {
            const newPurchase = await this.prismaService.purchase.create({
                data: {
                    user_id,
                    ...purchase
                }
            });

            return newPurchase;
        } catch (error) {
            if (!(error instanceof PrismaClientKnownRequestError)) {
                throw new Error('Purchase not created');
            }

            if (error.code === 'P2002') {
                throw new ForbiddenException('Purchase already exists');
            }

            throw error;
        }
    }

    async updatePurchase(user_id: number, purchase_id: number, data: any) {
        try {
            const updatedPurchase = await this.prismaService.purchase.update({
                where: {
                    id: purchase_id,
                    user_id
                },
                data
            });

            return updatedPurchase;
        } catch (error) {
            if (!(error instanceof PrismaClientKnownRequestError)) {
                throw new Error('Purchase not updated');
            }

            if (error.code === 'P2025') {
                throw new NotFoundException('Purchase not found');
            }

            throw error;
        }
    }

    async deletePurchase(user_id: number, id: number) {

        try {
            const deletedPurchase = await this.prismaService.purchase.delete({
                where: {
                    id,
                    user_id
                }
            });

            return deletedPurchase;
        } catch (error) {
            if (!(error instanceof PrismaClientKnownRequestError)) {
                throw new Error('Purchase not deleted');
            }

            if (error.code === 'P2025') {
                throw new NotFoundException('Purchase not found');
            }

            throw error;
        }

    }
}