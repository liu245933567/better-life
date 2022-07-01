import { Module } from '@nestjs/common';
import { ComicService } from './comic.service';
import { ComicController } from './comic.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema } from 'mongoose';

export const ComicHtmlCacheSchema = new Schema({
  href: String,
  html: String,
  time: String,
});

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ComicCache', schema: ComicHtmlCacheSchema },
    ]),
  ],
  providers: [ComicService],
  controllers: [ComicController],
})
export class ComicModule {}
