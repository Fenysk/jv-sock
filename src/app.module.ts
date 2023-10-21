import { ConfigModule } from '@nestjs/config';
import { GameModule } from './game/game.module';
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ArticleModule } from './article/article.module';
import { SaleModule } from './sale/sale.module';
import { UploadModule } from './upload/upload.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    PrismaModule,
    GameModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ArticleModule,
    SaleModule,
    UploadModule,
    AuthModule,
    UserModule,
    CartModule
  ],
  controllers: [AppController]
})
export class AppModule { }