import { Injectable, OnModuleInit } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as fsExtra from 'fs-extra';
import { WORK_DIR } from 'src/utils/workdir';
import { SseService } from 'src/sse/sse.service';
import { throttle } from 'lodash';
import WebTorrent from 'webtorrent';

@Injectable()
export class TorrentService implements OnModuleInit {
  private torrentClient: WebTorrent.Instance;
  private torrents: Record<string, WebTorrent.Torrent> = {};

  constructor(private readonly sseService: SseService) {}

  onModuleInit = async () => {
    const WebTorrent = (await import('webtorrent')).default;
    this.torrentClient = new WebTorrent();
  };

  removeTorrent = async (name: string) => {
    return new Promise((resolve, reject) => {
      if (this.torrents[name]) {
        this.torrents[name].destroy({ destroyStore: true }, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        });
      } else {
        resolve(true);
      }
    });
  };

  downloadTorrent = async (torrentPath: string) => {
    const torrentName = path.parse(torrentPath).name;

    const torrent = this.torrentClient.add(torrentPath, {
      path: path.join(WORK_DIR.tmp, torrentName),
    });

    this.torrents[torrentName] = torrent;

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
      torrent.destroy({}, async (err) => {
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

            delete this.torrents[torrentName];
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
