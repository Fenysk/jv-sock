import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GameService {
    constructor(private readonly prismaService: PrismaService) { }



    async getAllGames(name?: string) {

        let games: any[] = await this.prismaService.game.findMany({
            where: {
                name: {
                    contains: name,
                    mode: 'insensitive'
                }
            },
            include: {
                Purchases: {
                    include: {
                        Article: {
                            include: {
                                Sale: true
                            }
                        }
                    }
                }
            }
        });

        if (!games.length) {
            throw new NotFoundException('No games found');
        }

        // Determine quantity for each game
        games.forEach(game => {
            const gamePurchased = game.Purchases.length;
            const gameSolded = game.Purchases.filter(article => article.Sale).length;
            game.quantity = gamePurchased - gameSolded;
        });

        return games;
    }



    async getGamesInStock() {
        // On récupère l'inventaire des jeux
        const games: any[] = (await this.getAllGames());

        // On garde uniquement l'inventaire des jeux en stock
        const gamesWithStock = games.filter(game => game.quantity > 0);

        let gamesNotSaled = [];

        // Pour chaque jeu de l'inventaire
        gamesWithStock.forEach(game => {
            // On garde uniquement l'inventaire des jeux avec achats qui n'ont pas été vendus

            // Keep only purchases with article and no sale
            game.Purchases = game.Purchases.filter(purchase => purchase.Article && !purchase.Article.Sale);

            // Pour chaque achat du jeu non vendu
            game.Purchases.forEach(article => {

                // On crée un objet jeu non vendu
                const gameNotSaled = {
                    ...game,
                    article_id: article.id,
                    game_id: game.id,
                    articled_price: article.articled_price,
                    estimated_price: article.estimated_price,
                    origin: article.origin,
                    state: article.state,
                    content: article.content,
                    created_at: article.created_at,
                    updated_at: article.updated_at,
                }

                // On supprime les propriétés inutiles
                delete gameNotSaled.id;
                delete gameNotSaled.Purchases;
                delete gameNotSaled.Sale;
                delete gameNotSaled.quantity;

                // On ajoute l'objet jeu non vendu dans le tableau des jeux non vendus
                gamesNotSaled.push(gameNotSaled);
            });

        });

        if (!gamesNotSaled.length) {
            throw new NotFoundException('No games in stock');
        }

        // On trie les jeux non vendus par date de création (created_at)
        gamesNotSaled.sort((a, b) => (a.created_at > b.created_at) ? 1 : -1);

        return gamesNotSaled;
    }



    async getGameById(id: number) {
        let game: any = await this.prismaService.game.findUnique({
            where: { id: id },
            include: {
                Purchases: {
                    include: {
                        Article: {
                            include: {
                                Sale: true
                            }
                        }
                    }
                }
            }
        });

        if (!game) {
            throw new NotFoundException('Game not found');
        }

        const gamePurchased = game.Purchases.length;
        const gameSolded = game.Purchases.filter(article => article.Sale).length;
        game.quantity = gamePurchased - gameSolded;

        return game;
    }



    async createGame(game: any) {

        try {
            const createdGame = await this.prismaService.game.create({
                data: game
            });

            return createdGame;
        } catch (error) {
            if (!(error instanceof PrismaClientKnownRequestError)) {
                throw new Error('Game not created');
            }

            if (error.code === 'P2002') {
                throw new ConflictException('Game already exists');
            }

            throw error;
        }

    }



    async updateGame(id: number, data: any) {

        try {
            const updatedGame = await this.prismaService.game.update({
                where: { id: id },
                data
            });

            return updatedGame;
        } catch (error) {
            if (!(error instanceof PrismaClientKnownRequestError)) {
                throw new Error('Game not updated');
            }

            if (error.code === 'P2025') {
                throw new NotFoundException('Game not found');
            }

            if (error.code === 'P2002') {
                throw new ForbiddenException('Game already exists');
            }

            throw error;
        }

    }



    async deleteGame(id: number) {

        try {
            const deletedGame = await this.prismaService.game.delete({
                where: { id: id }
            });

            return deletedGame;
        } catch (error) {
            if (!(error instanceof PrismaClientKnownRequestError)) {
                throw new Error('Game not deleted');
            }

            if (error.code === 'P2025') {
                throw new NotFoundException('Game not found');
            }

            throw error;
        }

    }

}
