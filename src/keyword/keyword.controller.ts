import { Controller, Get } from '@nestjs/common';
import { KeywordService } from './keyword.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('script')
@Controller('keyword')
export class KeywordController {
  constructor(private readonly keywordService: KeywordService) {}

  @ApiOperation({ summary: '分析' })
  @Get()
  getKeyword() {
    return this.keywordService.getKeyword();
  }

  @ApiOperation({ summary: '获取关键词列表' })
  @Get('list')
  getKeywordList() {
    return this.keywordService.getKeywordList();
  }
}
