import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { GetUser, Roles } from 'src/auth/decorator';
import { Role } from 'src/auth/enums/role.enum';

@UseGuards(JwtGuard, RolesGuard)
@Controller('api/article')
export class ArticleController {
    constructor(private readonly articleService: ArticleService) { }

    @Roles(Role.ADMIN)
    @Get('get/all')
    getAllArticles(@Query('name') name?: string) {
        return this.articleService.getAllArticles(name);
    }

    @Roles(Role.SALLER)
    @Get('get/mine')
    getMyArticles(
        @GetUser('id') user_id: number,
        @Query('name') name?: string
    ) {
        return this.articleService.getMyArticles(user_id, name);
    }

    @Roles(Role.SALLER)
    @Get('get/:id')
    getArticleById(
        @GetUser('id') user_id: number,
        @Param('id') id: string
    ) {
        return this.articleService.getArticleById(user_id, Number(id));
    }

    @Roles(Role.SALLER)
    @Post('create')
    createArticle(
        @GetUser('id') user_id: number,
        @Body() article: CreateArticleDto
    ) {
        return this.articleService.createArticle(user_id, article);
    }

    @Roles(Role.SALLER)
    @Put('update/:id')
    updateArticle(
        @GetUser('id') user_id: number,
        @Param('id') article_id: string,
        @Body() data: any
    ) {
        return this.articleService.updateArticle(user_id, Number(article_id), data);
    }

    @Roles(Role.SALLER)
    @Delete('delete/:id')
    deleteArticle(
        @GetUser('id') user_id: number,
        @Param('id') id: string
    ) {
        return this.articleService.deleteArticle(user_id, Number(id));
    }

}
