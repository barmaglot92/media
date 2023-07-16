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

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly torrentService: TorrentService,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    /** */
  }

  async getList() {
    const ready = await glob(
      `${path.join(process.cwd(), this.configService.get('DATA_DIR'))}/*`,
      {
        withFileTypes: true,
        ignore: {
          ignored: (p) => !p.isDirectory(),
        },
      },
    );

    const inProgress = await glob(
      `${path.join(process.cwd(), this.configService.get('TEMP_DIR'))}/*`,
      {
        withFileTypes: true,
        ignore: {
          ignored: (p) => !p.isDirectory(),
        },
      },
    );

    return [
      ...inProgress.map((p) => ({ id: p.name, name: p.name })),
      ...ready.map((p) => ({ id: p.name, name: p.name })),
    ];
  }

  async downloadTorrent(file: Express.Multer.File) {
    const torrentPath = path.join(
      this.configService.get('TORRENT_DIR'),
      file.originalname,
    );

    let isFileExists = false;

    try {
      await fs.stat(torrentPath);
      isFileExists = true;
    } catch {}

    if (isFileExists) {
      throw new HttpException(
        `torrent file already exists`,
        HttpStatus.CONFLICT,
      );
    } else {
      await fs.writeFile(torrentPath, file.buffer);
      this.torrentService.downloadTorrent(file);
    }
  }
}
