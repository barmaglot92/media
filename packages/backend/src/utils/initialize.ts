import * as fs from 'fs/promises';
import { WORK_DIR } from './workdir';

export const initializeWorkDir = async () => {
  const paths = Object.keys(WORK_DIR);

  for (const key of paths) {
    try {
      await fs.stat(WORK_DIR[key]);
    } catch {
      await fs.mkdir(WORK_DIR[key], { recursive: true });
    }
  }
};
