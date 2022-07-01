import { Controller, Query, Get } from '@nestjs/common';
import { ComicService } from './comic.service';

@Controller('comic')
export class ComicController {
  constructor(private readonly comicService: ComicService) {}

  @Get('search')
  async findOne(@Query() query: { searchString: string }) {
    const res = await this.comicService.searchComic(query.searchString);

    return res;
  }
}
