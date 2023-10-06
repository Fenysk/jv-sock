import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/game.dto';

@Controller('api/game')
export class GameController {
    constructor(private readonly gameService: GameService) { }

    @Get('get/all')
    getAllGames() {
        return this.gameService.getAllGames();
    }

    @Get('get/stock')
    getGamesInStock() {
        return this.gameService.getGamesInStock();
    }

    @Get('get/:id')
    getGameById(@Param('id') id: string) {
        return this.gameService.getGameById(Number(id));
    }

    @Post('create')
    createGame(@Body() game: CreateGameDto) {
        return this.gameService.createGame(game);
    }

    @Put('update/:id')
    updateGame(@Param('id') id: string, @Body() game: CreateGameDto) {
        return this.gameService.updateGame(Number(id), game);
    }

    @Delete('delete/:id')
    deleteGame(@Param('id') id: string) {
        return this.gameService.deleteGame(Number(id));
    }

}
