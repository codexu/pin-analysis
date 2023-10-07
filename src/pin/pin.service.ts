import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import puppeteer from 'puppeteer';
import { Pin } from '../entities/pin.entity';
import { Keyword } from '../entities/keyword.entity';

@Injectable()
export class PinService {
  constructor(
    @InjectRepository(Pin)
    private readonly pinRepository: Repository<Pin>,
    @InjectRepository(Keyword)
    private readonly keywordRepository: Repository<Keyword>,
  ) {}

  async fetchPin() {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto('https://juejin.cn/pins/hot');
    await page.waitForSelector('.pin-list');
    // 每隔 5秒 滚动到底部，持续 5 次。
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await page.waitForTimeout(5000);
    }
    const result = await page.evaluate(() => {
      const list = [...document.querySelectorAll('.pin-list .pin')];
      const pins = list.map((pin) => {
        // data-pin-id 属性为 pin id
        const pinId = pin.getAttribute('data-pin-id');
        // .pin-header data-author-id 属性为作者 id
        const authorId = pin
          .querySelector('.pin-header')
          .getAttribute('data-author-id');
        // .content 为内容
        const content = pin.querySelector('.content').textContent;
        // .club 为圈子
        const club = pin.querySelector('.club')?.textContent;
        // comment-action 为评论数 转换 number 类型
        const comment = Number(
          pin.querySelector('.comment-action').textContent,
        );
        // like-action 为点赞数 转换 number 类型
        const like = Number(pin.querySelector('.like-action').textContent);

        return {
          pinId,
          authorId,
          content,
          club,
          comment,
          like,
        };
      });

      return pins;
    });
    await browser.close();

    // 遍历 result，将数据存入数据库
    for (let i = 0; i < result.length; i++) {
      const pin = result[i];
      const { pinId } = pin;
      // 通过 pinId 查询数据库，如果存在则更新，不存在则插入
      const existPin = await this.pinRepository.findOne({ where: { pinId } });
      if (existPin) {
        await this.pinRepository.update({ pinId }, pin);
      } else {
        await this.pinRepository.save(pin);
      }
    }

    return result;
  }
}
