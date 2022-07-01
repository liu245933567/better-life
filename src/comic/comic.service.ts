import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as dayjs from 'dayjs';
import { Model } from 'mongoose';
// import { ComicCache } from './interfaces/cache.interface';
import { Cocomanga } from './lib/cocomanga';

interface ComicCache extends Document {
  readonly href: string;
  readonly html: string;
  readonly time: string;
}

@Injectable()
export class ComicService {
  constructor(
    @InjectModel('ComicCache')
    private readonly comicCacheModel: Model<ComicCache>,
  ) {}

  /** 查询动漫 */
  async searchComic(searchStr: string) {
    const result = await this.searchComicFromCocomanga(searchStr);

    return result;
  }

  /** 获取查询结果 */
  async searchComicFromCocomanga(searchStr: string) {
    const href = Cocomanga.getSearchUrl(searchStr);
    const htmlText = await this.getHtmlText(href, Cocomanga.getCocomangaHtml);
    if (!htmlText) {
      return [];
    }

    const result = await Cocomanga.formatCocomangaSearch(htmlText);

    return result;
  }

  /**
   * 获取动漫详情
   * @param href 详情页原链接
   */
  async getComicDetailFromCocomanga(href: string) {
    const htmlText = await this.getHtmlText(href, Cocomanga.getCocomangaHtml);
    if (!htmlText) {
      return null;
    }

    const result = await Cocomanga.formatCocomangaDetail(htmlText);

    return result;
  }

  /**
   * 获取动漫章节详情
   * @param href 详情页原链接
   */
  async getComicChapterFromCocomanga(href: string) {
    const htmlText = await this.getHtmlText(href, Cocomanga.getCocomangaHtml);
    if (!htmlText) {
      return null;
    }

    const result = await Cocomanga.formatChapterDetail(htmlText);

    return result;
  }

  /** 获取页面文档 */
  async getHtmlText(
    href: string,
    queryMethod: (url: string) => Promise<string>,
  ) {
    const comicCatch = await this.comicCacheModel.findOne({ href }).exec();
    let htmlText = '';

    if (comicCatch) {
      htmlText = comicCatch.html;
    } else {
      htmlText = await queryMethod(href);
      if (!htmlText) {
        return null;
      }
      await this.comicCacheModel.findOneAndUpdate(
        { href },
        {
          href,
          html: htmlText,
          time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        },
        { upsert: true },
      );
    }

    return htmlText;
  }
}
