import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pin } from './entities/pin.entity';
import { Keyword } from './entities/keyword.entity';
import { PinService } from './pin/pin.service';
import { PinController } from './pin/pin.controller';
import { KeywordService } from './keyword/keyword.service';
import { KeywordController } from './keyword/keyword.controller';
import { AppController } from './app.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'MysqlPassword',
      database: 'pin-analysis',
      entities: [Pin, Keyword],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Pin, Keyword]),
  ],
  controllers: [AppController, PinController, KeywordController],
  providers: [PinService, KeywordService],
})
export class AppModule {}
