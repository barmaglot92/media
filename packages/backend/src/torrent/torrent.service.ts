import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as fsExtra from 'fs-extra';

@Injectable()
export class TorrentService implements OnModuleInit {
  torrentClient;

  constructor(private readonly configService: ConfigService) {}

  // rescanTempDir() {}

  onModuleInit = async () => {
    const WebTorrent = (await import('webtorrent')).default;
    this.torrentClient = new WebTorrent();
  };

  downloadTorrent = async (torrentFile: Express.Multer.File) => {
    const torrent = this.torrentClient.add(torrentFile.buffer, {
      path: path.join(
        this.configService.get('TEMP_DIR'),
        torrentFile.originalname,
      ),
    });

    // torrent.on('download', () => {
    //   console.log(torrent.downloaded);
    // });

    torrent.on('done', async () => {
      torrent.destroy(async (err) => {
        if (err) {
          console.log('remove torrent error', err);
        } else {
          try {
            await fs.rm(
              path.join(
                this.configService.get('TORRENT_DIR'),
                torrentFile.originalname,
              ),
              { recursive: true, force: true },
            );

            await fsExtra.move(
              path.join(
                this.configService.get('TEMP_DIR'),
                torrentFile.originalname,
              ),
              path.join(
                this.configService.get('DATA_DIR'),
                torrentFile.originalname,
              ),
              { overwrite: true },
            );
          } catch (err) {
            console.log(err);
          }
        }
      });
    });

    torrent.on('error', (err) => {
      console.log('download torrent error', err);
    });
  };
}
