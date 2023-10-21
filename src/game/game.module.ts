import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { ArticleModule } from 'src/article/article.module';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [ArticleModule, UploadModule],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService]
})
export class GameModule {}
