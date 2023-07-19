import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SseModule } from './sse/sse.module';
import { TorrentModule } from './torrent/torrent.module';

@Module({
  imports: [SseModule, TorrentModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
