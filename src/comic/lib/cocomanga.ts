import { ComicBase } from './types';
import puppeteer from 'puppeteer';
import { load } from 'cheerio';
import { getComicId } from './utils';

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

/**
 * 获取网站html文档
 * @description  https://www.cocomanga.com/
 */
async function getCocomangaHtml(url: string) {
  const browser = await puppeteer.launch(browserOpts);
  const page = await browser.newPage();

  await page.setRequestInterception(true);

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

  const $ = load(`<html>${htmlText}</<html>>`);

  return $;
}

export async function searchCocomanga(searchStr: string) {
  const result: ComicBase[] = [];

  const $ = await getCocomangaHtml(
    `${PATH}/search?type=1&searchString=${searchStr}`,
  );

  if (!$) {
    return result;
  }

  $('dl')?.each((i, el) => {
    const portraitUrl = $(el).find('dt a').attr('data-original');
    const href = $(el).find('dt a').attr('href');
    const name = $(el).find('dd a').text();

    result.push({
      id: getComicId(PATH, href),
      name,
      portraitUrl,
    });
  });

  return result;
}
