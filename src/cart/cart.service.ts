import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
    constructor(private readonly prismaService: PrismaService) { }

    async createNewCart(user_id: number) {
        try {
            // Get id of the active cart's user
            const activeCart = await this.getMyActiveCart(user_id);

            // Deactivate active cart
            const deactivatedCart = await this.desactivateCart(activeCart.id);

            // Create new cart
            const newCart = await this.prismaService.cart.create({ data: { user_id } });

            return newCart;
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



    async switchCart(user_id: number, cart_id: number) {
        try {
            // Get id of the active cart's user
            const activeCart = await this.getMyActiveCart(user_id);

            // Deactivate active cart
            const deactivatedCart = await this.desactivateCart(activeCart.id);

            // Activate new cart
            const activatedCart = await this.prismaService.cart.update({
                where: {
                    id: cart_id
                },
                data: {
                    is_active: true
                }
            });

            return activatedCart;
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



    async desactivateCart(cart_id: number) {
        try {
            const desactivatedCart = await this.prismaService.cart.update({
                where: {
                    id: cart_id
                },
                data: {
                    is_active: false
                }
            });

            return desactivatedCart;
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



    async getMyActiveCart(user_id: number) {
        try {
            const cart = await this.prismaService.cart.findFirst({
                where: {
                    user_id,
                    is_active: true
                },
                include: {
                    ArticlesOnCart: {
                        include: {
                            Article: true
                        }
                    }
                }
            });

            return cart;
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



    async addToCart(user_id: number, article_id: number) {
        try {
            // Get id of the active cart's user
            const activeCart = await this.getMyActiveCart(user_id);

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

            if (error.code === 'P2025') {
                throw new NotFoundException('Cart not found');
            }

            if (error.code === 'P2002') {
                throw new ConflictException('Article already in cart');
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
