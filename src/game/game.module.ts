import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { PurchaseModule } from 'src/purchase/purchase.module';

@Module({
  imports: [PurchaseModule],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService]
})
export class GameModule {}
