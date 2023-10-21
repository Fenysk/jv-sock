import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { GetUser, Roles } from 'src/auth/decorator';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { Role } from 'src/auth/enums/role.enum';

@UseGuards(JwtGuard, RolesGuard)
@Controller('api/cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Roles(Role.USER)
    @Get('get/mine')
    getMyCart(@GetUser('id') user_id: number) {
        return this.cartService.getMyCart(user_id);
    }

    @Roles(Role.USER)
    @Post('add/:id')
    addToCart(@GetUser('id') user_id: number, @Param('id') article_id: string) {
        console.log("ID de l'article : " + article_id);
        return this.cartService.addToCart(user_id, Number(article_id));
    }

    @Roles(Role.USER)
    @Delete('remove/:id')
    removeFromCart(@GetUser('id') user_id: number, @Param('id') article_id: string) {
        return this.cartService.removeFromCart(user_id, Number(article_id));
    }

}