import * as superagent from 'superagent';
import { load } from 'cheerio';

// import * as superagentProxy from 'superagent-proxy';
// import * as charset from 'superagent-charset';
// import { load, CheerioAPI } from 'cheerio';
// import fs from 'fs';
// import puppeteer from 'puppeteer';

// const PATH = 'https://readcomiconline.li';

/** 获取根页面信息 */
export function getReadcomiconlineHtml(searchResultPageUrl: string) {
  return new Promise((resolve) => {
    superagent
      .get(searchResultPageUrl)
      .set(
        'User-Agent',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
      )
      .set('Host', 'readcomiconline.li')
      .set('Connection', 'keep-alive')
      .set('Cookie', 'rco_quality=hq')
      .set('Accept-Language', 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,zh-TW;q=0.6')
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
