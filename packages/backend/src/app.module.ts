import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TorrentModule } from './torrent/torrent.module';
import { TorrentService } from './torrent/torrent.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TorrentModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, TorrentService],
})
export class AppModule {}
