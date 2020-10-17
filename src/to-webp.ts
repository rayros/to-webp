import * as cp from 'child_process';
import * as fs from 'fs';

import glob from 'glob';
import { promisify } from 'util';

const existsAsync = async (path: fs.PathLike) => {
  try {
    await fs.promises.access(path);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const execAsync = promisify(cp.exec);

const pathToWebP = (path: fs.PathLike) =>
  `${path.toString().split('.').slice(0, -1).join('.')}.webp`;

const isWebPAsync = (path: fs.PathLike) => existsAsync(path);

const getFileUpdatedDate = async (path: fs.PathLike) => {
  const stats = await fs.promises.stat(path);
  return stats.mtime;
};

const needGenerateWebP = async (path: fs.PathLike, webPPath: fs.PathLike) => {
  const [pathDate, webPDate] = await Promise.all([
    getFileUpdatedDate(path),
    getFileUpdatedDate(webPPath),
  ]);
  return pathDate > webPDate;
};

const toStats = async (path: fs.PathLike) => {
  const webPPath = pathToWebP(path);
  const isWebP = await isWebPAsync(webPPath);
  if (isWebP) {
    return {
      isWebP,
      path,
      webPPath,
      generateWebP: await needGenerateWebP(path, webPPath),
    };
  } else {
    return {
      isWebP,
      path,
      webPPath,
      generateWebP: true,
    };
  }
};

const runImagemin = async (matches: string[]) => {
  const statsList = await Promise.all(matches.map(toStats));
  const needGenerateWebPList = statsList.filter((stats) => stats.generateWebP);
  await Promise.all(
    needGenerateWebPList.map((stats) =>
      execAsync(`imagemin "${stats.path}" > "${stats.webPPath}"`)
    )
  );
};

export const toWebP = (pattern: string) =>
  new Promise((resolve: () => void, reject: (reason: any) => void) => {
    glob(
      pattern,
      async (error: Error | null, matches: string[]): Promise<void> => {
        if (error) {
          reject(error);
        }
        await runImagemin(matches);
        resolve();
      }
    );
  });
