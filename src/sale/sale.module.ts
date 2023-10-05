import { Module } from '@nestjs/common';
import { SaleController } from './sale.controller';
import { SaleService } from './sale.service';
import { PurchaseModule } from 'src/purchase/purchase.module';

@Module({
  imports: [PurchaseModule],
  controllers: [SaleController],
  providers: [SaleService]
})
export class SaleModule {}
