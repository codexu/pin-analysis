import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Keyword } from './entities/keyword.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  // 调用数据库 keyWord 表
  constructor(
    @InjectRepository(Keyword)
    private readonly keywordRepository: Repository<Keyword>,
  ) {}

  async getData() {
    // 获取 keyWord 表中的前 20 条数据，根据 hot 排序
    return await this.keywordRepository.find({
      order: {
        hot: 'DESC',
      },
      take: 20,
    });
  }
}
