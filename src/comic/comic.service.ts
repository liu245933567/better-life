import { Injectable } from '@nestjs/common';
import { searchCocomanga } from './lib/cocomanga';

@Injectable()
export class ComicService {
  async searchComic(searchStr: string) {
    const result = await searchCocomanga(searchStr);

    return result;
  }
}
