import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ArticleService } from 'src/article/article.service';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class SaleService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly articleService: ArticleService
    ) { }

    async getAllSales(name?: string) {
        const sales = await this.prismaService.sale.findMany({
            where: {
                Article: {
                    Purchase: {
                        Game: {
                            name: {
                                contains: name,
                                mode: 'insensitive'
                            }
                        }
                    }
                }
            },
            include: {
                Article: {
                    include: {
                        Purchase: {
                            include: {
                                Game: true
                            }
                        }
                    }
                }
            }
        });

        if (!sales.length) {
            throw new NotFoundException('No sales found');
        }

        return sales;
    }

    async getMySales(id: number, name?: string) {
        const sales = await this.prismaService.sale.findMany({
            where: {
                user_id: id,
                Article: {
                    Purchase: {
                        Game: {
                            name: {
                                contains: name,
                                mode: 'insensitive'
                            }
                        }
                    }
                }
            },
            include: {
                Article: {
                    include: {
                        Purchase: {
                            include: {
                                Game: true
                            }
                        }
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
        const sale = await this.prismaService.sale.findUnique({
            where: { id },
            include: {
                Article: {
                    include: {
                        Purchase: {
                            include: {
                                Game: true
                            }
                        }
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
        
        const article = await this.articleService.getMyArticleById(user_id, data.article_id);

        if (!article) {
            throw new NotFoundException('No article found');
        }

        try {
            const newSale = await this.prismaService.sale.create({
                data: {
                    user_id,
                    ...data
                }
            });

            return newSale;
        } catch (error) {
            if (!(error instanceof PrismaClientKnownRequestError)) {
                throw new Error('Sale not created');
            }

            if (error.code === 'P2002') {
                throw new ConflictException('Sale already exists');
            }

            throw error;
        }
    }

    async updateSoldedPrice(user_id: number, id: number, solded_price: number) {

        try {
            const updatedSale = await this.prismaService.sale.update({
                where: { id, user_id },
                data: { solded_price }
            });

            return updatedSale;
        } catch (error) {
            if (!(error instanceof PrismaClientKnownRequestError)) {
                throw new Error('Sale not updated');
            }

            if (error.code === 'P2025') {
                throw new NotFoundException('Sale not found');
            }

            if (error.code === 'P2003') {
                throw new ForbiddenException(`${error.meta.field_name} is not valid`);
            }

            throw error;
        }
    }

    async deleteSale(user_id: number, id: number) {
        try {
            const deletedSale = await this.prismaService.sale.delete({
                where: { id, user_id }
            });

            return deletedSale;
        } catch (error) {
            if (!(error instanceof PrismaClientKnownRequestError)) {
                throw new Error('Sale not deleted');
            }

            if (error.code === 'P2025') {
                throw new NotFoundException('Sale not found');
            }

            throw error;
        }
    }
}
