import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { PurchaseModule } from 'src/purchase/purchase.module';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [PurchaseModule, UploadModule],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService]
})
export class GameModule {}
