import * as path from 'path';

export const WORK_DIR = {
  tmp: path.join(process.cwd(), 'workDir', 'tmp'),
  torrents: path.join(process.cwd(), 'workDir', 'torrents'),
  data: path.join(process.cwd(), 'workDir', 'data'),
};
