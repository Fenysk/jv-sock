import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { CartModule } from 'src/cart/cart.module';
import { SaleModule } from 'src/sale/sale.module';

@Module({
  imports: [CartModule, SaleModule],
  providers: [OrderService],
  controllers: [OrderController]
})
export class OrderModule {}
