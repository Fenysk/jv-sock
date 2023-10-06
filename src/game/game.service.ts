import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { PurchaseService } from 'src/purchase/purchase.service';

@Injectable()
export class GameService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly purchaseService: PurchaseService
    ) { }

    async getAllGames() {
        let games: any[] = await this.prismaService.game.findMany({
            include: {
                Purchases: {
                    include: {
                        Sale: true
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
            const gameSolded = game.Purchases.filter(purchase => purchase.Sale).length;
            game.quantity = gamePurchased - gameSolded;
        });

        return games;
    }

    async getGamesInStock() {
        // On récupère l'inventaire des jeux
        const games: any[] = (await this.getAllGames());

        // On garde uniquement l'inventaire des jeux en stock
        const gamesInStock = games.filter(game => game.quantity > 0);

        let gamesNotSaled = [];



        // Pour chaque jeu de l'inventaire
        gamesInStock.forEach(game => {

            // On garde uniquement l'inventaire des jeux avec achats qui n'ont pas été vendus
            game.Purchases.filter(purchase => !purchase.Sale);

            // Pour chaque achat du jeu non vendu
            game.Purchases.forEach(purchase => {

                // On crée un objet jeu non vendu
                const gameNotSaled = {
                    ...game,
                    purchase_id: purchase.id,
                    game_id: game.id,
                    purchased_price: purchase.purchased_price,
                    estimated_price: purchase.estimated_price,
                    origin: purchase.origin,
                    state: purchase.state,
                    content: purchase.content,
                    created_at: purchase.created_at,
                    updated_at: purchase.updated_at,
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
                        Sale: true
                    }
                }
            }
        });

        if (!game) {
            throw new NotFoundException('Game not found');
        }

        const gamePurchased = game.Purchases.length;
        const gameSolded = game.Purchases.filter(purchase => purchase.Sale).length;
        game.quantity = gamePurchased - gameSolded;

        return game;
    }

    async createGame(game: any) {

        let createdGame;
        
        try {
            console.log('try to create game');
            createdGame = await this.prismaService.game.create({
                data: game
            });
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Game already exists');
                } else {
                    throw new Error('Game not created');
                }
            }
        }

        if (!createdGame) {
            throw new NotFoundException('Game not created');
        }

        return createdGame;
    }

    async updateGame(id: number, game: any) {
        const updatedGame = await this.prismaService.game.update({
            where: { id: id },
            data: game
        });

        if (!updatedGame) {
            throw new NotFoundException('Game not found');
        }

        return updatedGame;
    }

    async deleteGame(id: number) {
        const deleteGame = await this.prismaService.game.delete({
            where: { id: id }
        });

        if (!deleteGame) {
            throw new NotFoundException('Game not found');
        }

        return 'Game deleted successfully'
    }

}
