import { Controller, Get } from '@nestjs/common';
import { PinService } from './pin.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('script')
@Controller('pin')
export class PinController {
  constructor(private readonly pinService: PinService) {}

  @ApiOperation({ summary: '爬虫' })
  @Get()
  fetchPin() {
    return this.pinService.fetchPin();
  }
}
