import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { load, extract } from '@node-rs/jieba';
import { Keyword } from 'src/entities/keyword.entity';
import { Pin } from 'src/entities/pin.entity';
import { Repository } from 'typeorm';

load();

@Injectable()
export class KeywordService {
  constructor(
    @InjectRepository(Pin)
    private readonly pinRepository: Repository<Pin>,
    @InjectRepository(Keyword)
    private readonly keywordRepository: Repository<Keyword>,
  ) {}

  async getKeyword() {
    // 获取所有 pin，只获取 content、comment、like字段
    const pins = await this.pinRepository.find({
      select: ['content', 'comment', 'like'],
    });
    // 如果 keyword weight hot comment like 全部清零
    await this.keywordRepository
      .createQueryBuilder()
      .update()
      .set({
        weight: 0,
        hot: 0,
        comment: 0,
        like: 0,
      })
      .execute();
    // 遍历 pins，分析 content，提取关键词
    for (let i = 0; i < pins.length; i++) {
      const pin = pins[i];
      const { content, like, comment } = pin;
      const keywords = extract(content, 5, 'n,nr,ns,nt,nw,nz,vn');
      // 遍历 keywords，将数据存入数据库
      for (let j = 0; j < keywords.length; j++) {
        const keywordContent = keywords[j];
        const { weight, keyword } = keywordContent;
        // 在 keyword 表中查找 keyword 是否存在
        const keywordEntity = await this.keywordRepository.findOne({
          where: { word: keyword },
        });
        // 模糊查询 keyword 在 pinRepository 中的数量
        const count = await this.pinRepository
          .createQueryBuilder('pin')
          .where('pin.content LIKE :keyword', { keyword: `%${keyword}%` })
          .getCount();
        const hot = weight * (like + comment);
        // 如果存在，更新热度
        if (keywordEntity) {
          keywordEntity.hot += hot;
          keywordEntity.weight += weight;
          keywordEntity.count = count;
          keywordEntity.comment += comment;
          keywordEntity.like += like;
          await this.keywordRepository.save(keywordEntity);
        } else {
          // 如果不存在，创建 keywordEntity
          const newKeywordEntity = this.keywordRepository.create({
            word: keyword,
            weight,
            hot: hot,
            count,
            comment,
            like,
          });
          await this.keywordRepository.save(newKeywordEntity);
        }
      }
    }
  }

  async getKeywordList() {
    const keywordList = await this.keywordRepository.find({
      order: {
        hot: 'DESC',
      },
    });
    return keywordList;
  }
}
