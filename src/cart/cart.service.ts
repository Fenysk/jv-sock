import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
    constructor(private readonly prismaService: PrismaService) { }

    async createNewCart(user_id: number) {
        try {
            // Transaction to avoid creating a new cart without deactivating the active one
            const newCart = await this.prismaService.$transaction(async (prisma) => {
                // Create a new cart for the user
                const createdCart = await prisma.cart.create({ data: { user_id } });

                // Switch active cart to the new one
                const updatedUser = await prisma.user.update({
                    where: { id: user_id },
                    data: { active_cart_id: createdCart.id }
                });

                return createdCart;
            });

            return newCart;
        } catch (error) {
            if (!(error instanceof PrismaClientKnownRequestError)) { throw error; }
            if (error.code === 'P2025') { throw new NotFoundException('Cart not found'); }
            throw error;
        }
    }



    async switchCart(user_id: number, cart_id: number) {
        try {
            const updatedUser = await this.prismaService.user.update({
                where: {
                    id: user_id,
                    Carts: { some: { id: cart_id } }
                },
                data: { active_cart_id: cart_id }
            });

            return updatedUser;
        } catch (error) {
            if (!(error instanceof PrismaClientKnownRequestError)) { throw error; }
            if (error.code === 'P2025') { throw new NotFoundException('Cart not found'); }
            throw error;
        }
    }



    async getMyActiveCart(user_id: number) {
        try {
            // Get cart of the user in function of the active cart id
            const user = await this.prismaService.user.findUnique({
                where: { id: user_id },
                select: { active_cart_id: true }
            });

            if (!user) { throw new NotFoundException('User not found'); }

            const userCart = await this.prismaService.cart.findUnique({
                where: { id: user.active_cart_id },
                include: { ArticlesOnCart: { include: { Article: true } } }
            });

            return userCart;
        } catch (error) {
            if (!(error instanceof PrismaClientKnownRequestError)) { throw error; }
            if (error.code === 'P2025') { throw new NotFoundException('Cart not found'); }
            throw error;
        }
    }



    async addToCart(user_id: number, article_id: number) {
        try {
            // Get id of the active cart's user
            const activeCart = await this.getMyActiveCart(user_id);

            // Check if article is available
            const article = await this.prismaService.article.findFirst({
                where: {
                    id: article_id,
                    Sale: { is: null }
                }
            });

            if (!article) {
                throw new NotFoundException('Article not found');
            }

            // Add article to cart
            const articleAddedToCart = await this.prismaService.articlesOnCart.create({
                data: {
                    cart_id: activeCart.id,
                    article_id
                }
            });

            return articleAddedToCart;
        } catch (error) {
            if (!(error instanceof PrismaClientKnownRequestError)) {
                throw error;
            }

            if (error.code === 'P2002') {
                throw new ConflictException('Article already in cart');
            }

            if (error.code === 'P2003') {
                throw new ForbiddenException(`${error.meta.field_name} is not valid`);
            }

            if (error.code === 'P2025') {
                throw new NotFoundException('Cart not found');
            }

            throw error;
        }
    }



    async removeFromCart(user_id: number, article_id: number) {
        try {
            // Get id of the active cart's user
            const activeCart = await this.getMyActiveCart(user_id);

            // Remove article from cart
            const articleRemovedFromCart = await this.prismaService.articlesOnCart.delete({
                where: {
                    cart_id_article_id: {
                        cart_id: activeCart.id,
                        article_id
                    }
                }
            });

            return articleRemovedFromCart;
        } catch (error) {
            if (!(error instanceof PrismaClientKnownRequestError)) {
                throw error;
            }

            if (error.code === 'P2025') {
                throw new NotFoundException('Cart not found');
            }

            throw error;
        }
    }

}
