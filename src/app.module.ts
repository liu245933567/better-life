import { Module } from '@nestjs/common';
import { NestLogsModule } from 'nest-logs';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogModule } from './blog/blog.module';

@Module({
  imports: [
    NestLogsModule,
    MongooseModule.forRoot('mongodb://localhost/nest-blog', {
      useNewUrlParser: true,
    }),
    BlogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
