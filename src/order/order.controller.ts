import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { GetUser, Roles } from 'src/auth/decorator';
import { Role } from 'src/auth/enums/role.enum';

@UseGuards(JwtGuard, RolesGuard)
@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Roles(Role.USER)
    @Get('get/mine')
    async getMyOrders(@GetUser('id') user_id) {
        return await this.orderService.getMyOrders(user_id);
    }

    @Roles(Role.USER)
    @Post('create')
    async createOrder(@GetUser('id') user_id) {
        return await this.orderService.createOrder(user_id);
    }

}
