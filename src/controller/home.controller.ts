import { Controller, Get } from '@midwayjs/core';
import { IgnoreAuth } from '../decorator/ignoreAuth';

@Controller('/')
export class HomeController {
  @Get('/')
  // 忽略鉴权
  @IgnoreAuth()
  async home(): Promise<string> {
    return 'Hello Midwayjs!';
  }
}
