import { Inject, Controller, Post, Body } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';
import { smsDto } from '../dto/common';
import { SmsService } from '../service/sms.service';
import { IgnoreAuth } from '../decorator/ignoreAuth';
import { RedisService } from '@midwayjs/redis';

@Controller('/api')
export class APIController {
  @Inject()
  ctx: Context;

  @Inject()
  smsService: SmsService;

  @Inject()
  userService: UserService;

  @Inject()
  redisService: RedisService;

  @Post('/sendSMS')
  @IgnoreAuth()
  async sendSMS(@Body() params: smsDto) {
    const codeKey = this.smsService.setKey(params.type, params.mobile);
    const has = await this.redisService.get(codeKey);
    if (has) throw new Error('请勿重复发送');
    const code = await this.smsService.sendSms(params.type, params.mobile);
    console.log(code);
    return !!code;
  }
}
