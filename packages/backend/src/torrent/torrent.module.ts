import { Module } from '@nestjs/common';
import { TorrentService } from './torrent.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [TorrentService],
})
export class TorrentModule {}
