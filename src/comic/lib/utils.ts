import * as superagent from 'superagent';
import fs from 'fs';
import * as path from 'path';

/** 爬虫源地址 */
export const getOriginHref = (source: string, path: string) => {
  return `${source}${path}`;
};

/**
 * 保存图片
 * @param imgSrc
 * @param name
 * @param dir
 * @returns
 */
export async function saveImage(
  imgSrc: string,
  name: string,
  dir: string,
): Promise<boolean> {
  return new Promise((resolve) => {
    superagent.get(imgSrc).end((err, res) => {
      if (err) {
        resolve(false);
        return;
      }
      fs.writeFile(path.join(dir, name), res.body, 'binary', function (err) {
        if (err) {
          resolve(false);
          return;
        }
        resolve(true);
      });
    });
  });
}
