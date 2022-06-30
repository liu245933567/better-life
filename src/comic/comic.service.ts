import { Injectable } from '@nestjs/common';
// import * as http from 'http';
import * as superagent from 'superagent';
import * as path from 'path';
import * as superagentProxy from 'superagent-proxy';
// import * as charset from 'superagent-charset';
import { load, CheerioAPI } from 'cheerio';
import fs from 'fs';

// charset(superagent);
superagentProxy(superagent);

@Injectable()
export class ComicService {
  getCooooHtml(): Promise<{
    htmlText: string | null;
    $: CheerioAPI;
  }> {
    return new Promise((resolve) => {
      superagent
        .get('https://www.cocomanga.com/')
        .set(
          'User-Agent',
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
        )
        .set('Host', 'www.cocomanga.com')
        .set('Connection', 'keep-alive')
        .set(
          'Accept-Language',
          'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,zh-TW;q=0.6',
        )
        .then((res) => {
          const htmlText: string = res.text;
          const $ = load(htmlText);

          resolve({
            /** html 信息 */
            htmlText,
            /** 模拟dom */
            $,
          });
        })
        .catch((err) => {
          resolve({ htmlText: null, $: null });
        });
    });
  }

  /** 获取根页面信息 */
  getComicHtml(searchResultPageUrl: string): Promise<{
    htmlText: string | null;
    $: CheerioAPI;
  }> {
    return new Promise((resolve) => {
      const options = {
        host: '127.0.0.1',
        port: '41091',
        path: searchResultPageUrl,
        method: 'GET',
        headers: {
          Host: 'readcomiconline.li',
        },
      };

      superagent
        .get(searchResultPageUrl)
        .set(
          'User-Agent',
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
        )
        .set('Host', 'readcomiconline.li')
        .set('Connection', 'keep-alive')
        .set('Cookie', 'rco_quality=hq')
        .set(
          'Accept-Language',
          'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,zh-TW;q=0.6',
        )
        .then((res) => {
          const htmlText: string = res.text;
          const $ = load(htmlText);

          resolve({
            /** html 信息 */
            htmlText,
            /** 模拟dom */
            $,
          });
        })
        .catch((err) => {
          resolve({ htmlText: null, $: null });
        });
    });
  }

  async getComicInfo(searchResultPageUrl: string) {
    const { htmlText, $ } = await this.getComicHtml(searchResultPageUrl);
    if (!htmlText) {
      return { htmlText: '出错了' };
    }
    const title = $('.bigChar').text();

    const result: { chapterName: string; href: string }[] = [];

    const list = $('td > a').each((i, v) => {
      result.push({
        chapterName: $(v).text(),
        href: $(v).attr('href'),
      });
    });

    return { htmlText, title, list };
  }

  /**
   * 保存图片
   * @param imgSrc
   * @param name
   * @param dir
   * @returns
   */
  saveImage(imgSrc: string, name: string, dir: string): Promise<boolean> {
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
}
