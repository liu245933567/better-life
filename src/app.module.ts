import { Module } from '@nestjs/common';
import { NestLogsModule } from 'nest-logs';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogModule } from './blog/blog.module';
import { UserModule } from './user/user/user.module';
import { ComicService } from './comic/comic.service';
import { ComicModule } from './comic/comic.module';
import { ComicController } from './comic/comic.controller';

@Module({
  imports: [
    NestLogsModule,
    MongooseModule.forRoot('mongodb://localhost/nest-blog', {
      useNewUrlParser: true,
    }),
    BlogModule,
    UserModule,
    ComicModule,
  ],
  controllers: [AppController, ComicController],
  providers: [AppService, ComicService],
})
export class AppModule {}
