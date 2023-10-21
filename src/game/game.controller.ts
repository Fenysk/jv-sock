import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/game.dto';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { Roles } from 'src/auth/decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('api/game')
export class GameController {
    constructor(private readonly gameService: GameService) { }

    @Get('get/all')
    getAllGames(@Query('name') name?: string) {
        return this.gameService.getAllGames(name);
    }

    @Get('get/stock')
    getGamesInStock() {
        return this.gameService.getGamesInStock();
    }

    @Get('get/:id')
    getGameById(@Param('id') id: string) {
        return this.gameService.getGameById(Number(id));
    }

    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post('create')
    createGame(@Body() game: CreateGameDto) {
        return this.gameService.createGame(game);
    }

    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Put('update/:id')
    updateGame(@Param('id') id: string, @Body() data: any) {
        return this.gameService.updateGame(Number(id), data);
    }

    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('delete/:id')
    deleteGame(@Param('id') id: string) {
        return this.gameService.deleteGame(Number(id));
    }

}
