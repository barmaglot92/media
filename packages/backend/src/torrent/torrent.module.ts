import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SseModule } from 'src/sse/sse.module';
import { TorrentService } from './torrent.service';

@Module({
  imports: [SseModule, ConfigModule.forRoot()],
  providers: [TorrentService],
  exports: [TorrentService],
})
export class TorrentModule {}
