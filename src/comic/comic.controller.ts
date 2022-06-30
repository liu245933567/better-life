import { Controller, Body, Post } from '@nestjs/common';
import { ComicService } from './comic.service';

@Controller('comic')
export class ComicController {
  constructor(private readonly comicService: ComicService) {}

  @Post('item')
  async findOne(@Body() body: { source: string }) {
    const res = await this.comicService.getCooooHtml();

    return res.htmlText;
  }
}
