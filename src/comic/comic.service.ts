import { Injectable } from '@nestjs/common';
// import * as http from 'http';
import * as superagent from 'superagent';
import * as superagentProxy from 'superagent-proxy';
// import * as charset from 'superagent-charset';
import { load, CheerioAPI } from 'cheerio';

// charset(superagent);
superagentProxy(superagent);

@Injectable()
export class ComicService {
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
      // https
      //   .get(searchResultPageUrl, function (res) {
      //     console.log('statusCode: ', res.statusCode);
      //     console.log('headers: ', res.headers);

      //     res.on('data', function (d) {
      //       process.stdout.write(d);
      //       resolve({ htmlText: null, $: null });
      //     });
      //   })
      //   .on('error', function (e) {
      //     console.error(e);
      //     resolve({ htmlText: null, $: null });
      //   });

      // const request = http.request(options, function (response) {
      //   let str = '';
      //   response.on('data', function (data) {
      //     str += data;
      //     resolve({ htmlText: null, $: null });
      //   });
      //   response.on('end', function () {
      //     console.log(str);
      //     resolve({ htmlText: null, $: null });
      //   });
      // });

      // request.on('error', function (e) {
      //   console.log('Problem with request: ' + e.message);
      //   resolve({ htmlText: null, $: null });
      // });
      superagent
        .get(searchResultPageUrl)
        // .buffer(true)
        .proxy('http://127.0.0.1:41091')
        // .set('User-Agent', 'PostmanRuntime/7.29.0')
        // .set('Accept', '*/*')
        // .set('Postman-Token', 'dd7c254e-a61e-44b3-8617-a254e93b4cfc')
        // .set('Host', 'readcomiconline.li')
        // .set('Accept-Encoding', 'gzip, deflate, br')
        // .set('Connection', 'keep-alive')
        // .set('Cookie', 'rco_quality=hq')
        // .buffer(true)
        //
        // @ts-ignore
        // .charset('gb2312')
        .then((res) => {
          console.log('res.body = ', res.body);
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

  async getComicContent(searchResultPageUrl: string) {
    const res = await this.getComicHtml(searchResultPageUrl);
    console.log(res);
  }
}
