import { ConfigModule } from '@nestjs/config';
import { GameModule } from './game/game.module';
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { PurchaseModule } from './purchase/purchase.module';
import { SaleModule } from './sale/sale.module';

@Module({
  imports: [
    PrismaModule,
    GameModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PurchaseModule,
    SaleModule,
  ],
})
export class AppModule { }
