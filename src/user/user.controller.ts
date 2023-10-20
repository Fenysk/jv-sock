import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('get/all')
    async getAllUsers() {
        return await this.userService.getAllUsers();
    }

    // TODO: Implement this route
    @Get('get/me')
    async getMe() {
        return 'get me';
    }

    @Get('get/:id')
    async getUserById(@Param('id') id: string) {
        return await this.userService.getUserById(Number(id));
    }

    // TODO: Implement this route
    @Put('update/me')
    async updateMe(@Body() data: any) {
        return 'update me';
    }

    @Put('update/:id')
    async updateUserById(@Param('id') id: string, @Body() data: any) {
        return await this.userService.updateUserById(Number(id), data);
    }

    @Delete('delete/:id')
    async deleteUserById(@Param('id') id: string) {
        return await this.userService.deleteUserById(Number(id));
    }

}
