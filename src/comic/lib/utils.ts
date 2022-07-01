import * as superagent from 'superagent';
import fs from 'fs';
import * as path from 'path';

/** 动漫 id 分割线 */
export const SEPARAPOR = '__';

/** 获取动漫唯一标识符 id */
export const getComicId = (source: string, path: string) => {
  return `${source}${SEPARAPOR}${path}`;
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
