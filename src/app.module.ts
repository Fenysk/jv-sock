import { ConfigModule } from '@nestjs/config';
import { GameModule } from './game/game.module';
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { PurchaseModule } from './purchase/purchase.module';
import { SaleModule } from './sale/sale.module';
import { UploadModule } from './upload/upload.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CartModule } from './cart/cart.module';
import { ArticleModule } from './article/article.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    PrismaModule,
    GameModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PurchaseModule,
    SaleModule,
    UploadModule,
    AuthModule,
    UserModule,
    CartModule,
    ArticleModule,
    OrderModule
  ],
  controllers: [AppController]
})
export class AppModule { }