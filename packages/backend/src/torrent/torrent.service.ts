import { Injectable, OnModuleInit } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as fsExtra from 'fs-extra';
import { WORK_DIR } from 'src/utils/workdir';
import { SseService } from 'src/sse/sse.service';
import { throttle } from 'lodash';

@Injectable()
export class TorrentService implements OnModuleInit {
  torrentClient;

  constructor(private readonly sseService: SseService) {}

  onModuleInit = async () => {
    const WebTorrent = (await import('webtorrent')).default;
    this.torrentClient = new WebTorrent();
  };

  downloadTorrent = async (torrentPath: string) => {
    const torrentName = path.parse(torrentPath).name;

    const torrent = this.torrentClient.add(torrentPath, {
      path: path.join(WORK_DIR.tmp, torrentName),
    });

    const debouncedHandleProgress = throttle(
      () => {
        this.sseService.addEvent({
          data: {
            name: torrentName,
            progress: torrent.progress,
          },
        });
      },
      2000,
      { leading: false, trailing: true },
    );

    torrent.on('download', debouncedHandleProgress);

    torrent.on('done', async () => {
      torrent.destroy(async (err) => {
        if (err) {
          console.log('remove torrent error', err);
        } else {
          try {
            await fs.rm(torrentPath, { recursive: true, force: true });

            await fsExtra.move(
              path.join(WORK_DIR.tmp, torrentName),
              path.join(WORK_DIR.data, torrentName),
              { overwrite: true },
            );

            this.sseService.addEvent({
              data: {
                [torrentName]: 100,
              },
            });
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
