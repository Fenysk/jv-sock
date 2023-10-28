import { Body, Controller, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { GetUser, Roles } from 'src/auth/decorator';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { Role } from 'src/auth/enums/role.enum';

@UseGuards(JwtGuard, RolesGuard)
@Controller('api/user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Roles(Role.ADMIN)
    @Get('get/all')
    async getAllUsers() {
        return await this.userService.getAllUsers();
    }

    @Get('get/me')
    async getMe(@GetUser() user: User) {
        return user;
    }

    @Roles(Role.ADMIN)
    @Get('get/:id')
    async getUserById(@Param('id') id: string) {
        return await this.userService.getUserById(Number(id));
    }

    @Put('update/me')
    async updateMe(@GetUser('id') user_id: number, @Body() data: any) {
        return await this.userService.updateUserById(user_id, data);
    }

    @Put('update/me/password')
    async updateMyPassword(@GetUser('id') user_id: number, @Body() data: any) {
        return await this.userService.updateMyPassword(user_id, data.password);
    }

    @Roles(Role.ADMIN)
    @Put('update/:id')
    async updateUserById(@Param('id') id: string, @Body() data: any) {
        return await this.userService.updateUserById(Number(id), data);
    }

    @Delete('delete/me')
    async deleteMe(@GetUser('id') user_id: number) {
        return await this.userService.deleteUserById(user_id);
    }

    @Roles(Role.ADMIN)
    @Delete('delete/:id')
    async deleteUserById(@Param('id') id: string) {
        return await this.userService.deleteUserById(Number(id));
    }

}