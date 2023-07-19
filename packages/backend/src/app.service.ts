import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { TorrentService } from './torrent/torrent.service';
import { glob } from 'glob';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import { WORK_DIR } from './utils/workdir';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly torrentService: TorrentService,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    /** */
  }

  async delete(name: string) {
    await Promise.all([
      fs.rm(path.join(WORK_DIR.data, name), { recursive: true, force: true }),
      fs.rm(path.join(WORK_DIR.tmp, name), { recursive: true, force: true }),
      fs.rm(path.join(WORK_DIR.torrents, name), {
        recursive: true,
        force: true,
      }),
    ]);
  }

  async getList() {
    const ready = await glob(`${WORK_DIR.data}/*`, {
      withFileTypes: true,
      ignore: {
        ignored: (p) => !p.isDirectory(),
      },
    });

    const inProgress = await glob(`${WORK_DIR.tmp}/*`, {
      withFileTypes: true,
      ignore: {
        ignored: (p) => !p.isDirectory(),
      },
    });

    return [
      ...inProgress.map((p) => ({ name: p.name, status: 'processing' })),
      ...ready.map((p) => ({ name: p.name, status: 'ready' })),
    ];
  }

  async downloadTorrent(file: Express.Multer.File) {
    const torrentPath = path.join(WORK_DIR.torrents, file.originalname);

    let isFileExists = false;

    try {
      await fs.stat(torrentPath);
      isFileExists = true;
    } catch {}

    try {
      await fs.stat(path.join(WORK_DIR.tmp, file.originalname));
      isFileExists = true;
    } catch {}

    try {
      await fs.stat(path.join(WORK_DIR.data, file.originalname));
      isFileExists = true;
    } catch {}

    if (isFileExists) {
      throw new HttpException(
        `torrent file already exists`,
        HttpStatus.CONFLICT,
      );
    } else {
      await fs.writeFile(torrentPath, file.buffer);
      this.torrentService.downloadTorrent(torrentPath);
    }
  }
}
