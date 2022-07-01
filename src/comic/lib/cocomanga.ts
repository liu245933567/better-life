import { ComicBase, ComicDetail } from './types';
import puppeteer from 'puppeteer';
import { load } from 'cheerio';
import { getOriginHref } from './utils';

const PATH = 'https://www.cocomanga.com';

const browserOpts = {
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    "--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3902.4 Safari/537.36',// 'Mozilla/5.0 (X11; Linux x86_64; rv:68.0) Gecko/20100101 Firefox/68.0",
    '--remote-debugging-port=9222',
  ],
};

export class Cocomanga {
  static getSearchUrl(searchStr: string) {
    return `${PATH}/search?type=1&searchString=${searchStr}`;
  }

  /**
   * 获取网站html文档
   * @description  https://www.cocomanga.com/
   */
  static async getCocomangaHtml(url: string) {
    const browser = await puppeteer.launch(browserOpts);
    const page = await browser.newPage();

    await page.setRequestInterception(true);

    await page.setDefaultNavigationTimeout(180000);

    page.on('request', (interceptRequest) => {
      const headers = Object.assign({}, interceptRequest.headers(), {
        'Accept-Language': 'zh-CN,zh;q=0.5',
      });

      interceptRequest.continue({ headers });
    });

    await page.goto(url);

    const htmlText = await page.$eval('html', (elements) => elements.innerHTML);

    await browser.close();

    if (typeof htmlText !== 'string' || htmlText.indexOf('<body') < 0) {
      return null;
    }

    return `<html>${htmlText}</<html>>`;
  }

  /**
   * 格式化查询结果
   * @param htmlText 页面文本
   * @returns
   */
  static async formatCocomangaSearch(htmlText: string) {
    const result: ComicBase[] = [];

    const $ = load(htmlText);

    $('dl')?.each((i, el) => {
      const portraitUrl = $(el).find('dt a').attr('data-original');
      const href = $(el).find('dt a').attr('href');
      const name = $(el).find('dd a').text();

      result.push({
        originHref: getOriginHref(PATH, href),
        name,
        portraitUrl,
      });
    });

    return result;
  }

  /** 详情页数据 */
  static async formatCocomangaDetail(htmlText: string) {
    const $ = load(htmlText);

    const portraitUrl = $('dt a').attr('data-original');
    const comicName = $('h1').text();

    const result: ComicDetail = {
      originHref: '',
      portraitUrl,
      name: comicName,
      chapters: [],
    };

    $('.all_data_list ul li a')?.each((i, el) => {
      const href = $(el).attr('href');
      const name = $(el).attr('title');

      result.chapters.push({
        originHref: getOriginHref(PATH, href),
        name,
      });
    });

    return result;
  }

  /** 章节页数据 */
  static async formatChapterDetail(htmlText: string) {
    const $ = load(htmlText);
    const result = {
      name: '',
      images: [],
    };

    $('.mh_comicpic img')?.each((i, el) => {
      const href = $(el).attr('src');

      result.images.push(href);
    });

    return result;
  }
}
