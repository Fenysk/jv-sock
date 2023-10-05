import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GameService {
    constructor(private readonly prismaService: PrismaService) { }

    async getAllGames() {
        const games = await this.prismaService.game.findMany();

        if (!games.length) {
            throw new NotFoundException('No games found');
        }

        return games;
    }

    async getGameById(id: number) {
        const game = await this.prismaService.game.findUnique({
            where: { id: id }
        });

        if (!game) {
            throw new NotFoundException('Game not found');
        }

        return game;
    }

    async createGame(game: any) {
        const createdGame = await this.prismaService.game.create({
            data: game
        });
        
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
