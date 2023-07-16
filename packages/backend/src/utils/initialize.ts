import * as fs from 'fs/promises';
import * as path from 'path';

export const initializeWorkDir = async () => {
  const paths = [
    path.join(process.cwd(), process.env.TEMP_DIR),
    path.join(process.cwd(), process.env.TORRENT_DIR),
    path.join(process.cwd(), process.env.DATA_DIR),
  ];

  for (const path of paths) {
    try {
      await fs.stat(path);
    } catch {
      await fs.mkdir(path, { recursive: true });
    }
  }
};
