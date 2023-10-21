import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
    constructor(private readonly prismaService: PrismaService) { }

    async getMyCart(user_id: number) {
        const cart = await this.prismaService.articlesOnCart.findMany({
            where: { cart_id: user_id },
            include: { Article: true }
        });

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        return cart;
    }

    async addToCart(user_id: number, article_id: number) {

        // Check if article exists
        const article = await this.prismaService.article.findFirst({
            where: { id: article_id },
            include: { Sale: true }
        });

        if (!article) {
            throw new NotFoundException('Article not found');
        }

        // Check if article has no sale
        if (article.Sale) {
            throw new ConflictException('Article is already sold');
        }

        // Add article to cart
        try {
            const newArticleOnCart = await this.prismaService.articlesOnCart.create({
                data: {
                    cart_id: user_id,
                    article_id,
                }
            });

            return newArticleOnCart;
        } catch (error) {
            if (!(error instanceof PrismaClientKnownRequestError)) {
                throw new Error('Impossible to add article to cart');
            }

            if (error.code === 'P2002') {
                throw new ConflictException('Article already in cart');
            }

            if (error.code === 'P2025') {
                throw new NotFoundException('Cart not found');
            }

            throw error;
        }
    }

    async removeFromCart(user_id: number, article_id: number) {

        // Check if article is in cart's user
        const articleOnCart = await this.prismaService.articlesOnCart.findUnique({
            where: {
                cart_id: user_id,
                article_id
            }
        });

        if (!articleOnCart) {
            throw new NotFoundException('Article not found in cart');
        }

        // Remove article from cart
        try {
            const deletedArticleOnCart = await this.prismaService.articlesOnCart.delete({ where: { article_id } });

            return deletedArticleOnCart;
        } catch (error) {
            if (!(error instanceof PrismaClientKnownRequestError)) {
                throw new Error('Impossible to remove article from cart');
            }

            if (error.code === 'P2025') {
                throw new NotFoundException('Cart not found');
            }

            throw error;
        }
    }
}
