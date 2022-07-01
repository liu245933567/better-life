import { Controller, Query, Get } from '@nestjs/common';
import { ComicService } from './comic.service';

@Controller('comic')
export class ComicController {
  constructor(private readonly comicService: ComicService) {}

  @Get('search')
  async search(@Query() query: { searchString: string }) {
    const res = await this.comicService.searchComic(query.searchString);

    return res;
  }

  @Get('detail')
  async detail(@Query() query: { origonHref: string }) {
    const res = await this.comicService.getComicDetailFromCocomanga(
      query.origonHref,
    );

    return res;
  }

  @Get('chapter')
  async chapter(@Query() query: { origonHref: string }) {
    const res = await this.comicService.getComicChapterFromCocomanga(
      query.origonHref,
    );

    return res;
  }
}
