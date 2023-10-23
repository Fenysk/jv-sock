import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CartService } from 'src/cart/cart.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly cartService: CartService
    ) { }

    async getMyOrders(user_id: number) {
        const orders = await this.prismaService.order.findMany({ where: { user_id } });

        if (!orders.length) { throw new NotFoundException('No orders found'); }

        return orders;
    }



    async createOrder(user_id: number) {
        try {
            // Active cart
            const activeCart = await this.cartService.getMyActiveCart(user_id);

            // All articles on cart
            const articlesOnCart = await this.prismaService.cart.findUnique({
                where: {
                    id: activeCart.id
                },
                include: {
                    ArticlesOnCart: {
                        include: {
                            Article: {
                                include: {
                                    Sale: true
                                }
                            }
                        }
                    }
                }
            })

            const articles = articlesOnCart.ArticlesOnCart.map((articleOnCart) => {
                return articleOnCart.Article;
            })

            if (!articles.length) {
                throw new NotFoundException('No articles found in cart');
            }

            // Articles has no sale
            articles.forEach((article) => {
                if (article.Sale) {
                    throw new BadRequestException('Article has a sale');
                }
            })

            // Transaction
            await this.prismaService.$transaction(async (prisma) => {

                // New order
                const newOrder = await prisma.order.create({
                    data: {
                        user_id,
                        cart_id: activeCart.id
                    }
                });

                // New sales
                const newSales = await prisma.sale.createMany({
                    data: articles.map((article) => {
                        return {
                            user_id: article.user_id,
                            article_id: article.id,
                            solded_price: article.price,
                            order_id: newOrder.id
                        }
                    })
                });
                
            });

            // New cart
            await this.cartService.createNewCart(user_id);

            // Get updated order
            const newOrder = await this.prismaService.order.findMany({
                where: { user_id },
                include: { Cart: { include: { ArticlesOnCart: { include: { Article: { include: { Purchase: { include: { Game: true } } } } } } } } }
            });

            return newOrder;
        } catch (error) {
            if (!(error instanceof PrismaClientKnownRequestError)) {
                throw error;
            }

            console.log("CODE : ", error.code);

            if (error.code === 'P2025') {
                throw new NotFoundException('No active cart found');
            }

            throw error;
        }
    }

}