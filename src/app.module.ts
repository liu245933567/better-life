import { Module } from '@nestjs/common';
import { NestLogsModule } from 'nest-logs';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogModule } from './blog/blog.module';
import { UserModule } from './user/user/user.module';
import { ComicModule } from './comic/comic.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://180.76.121.22:27017/blog', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      authSource: 'admin',
      auth: {
        username: 'liuyonghui',
        password: 'liu199699',
      },
    }),
    NestLogsModule,
    BlogModule,
    UserModule,
    ComicModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
