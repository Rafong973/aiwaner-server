import { App, Inject, Provide } from '@midwayjs/core';
import { Application, Context } from '@midwayjs/koa';
import { RedisService } from '@midwayjs/redis';

@Provide()
export class SmsService {
  @App()
  app: Application;

  @Inject()
  ctx: Context;

  @Inject()
  redisService: RedisService;

  /**
   * type 类型
   * 1 注册验证码
   * 2 登录验证码
   *
   * */
  async sendSms(
    type: string | number,
    append?: number | string
  ): Promise<string> {
    return await this.generateUniqueCode(type, append);
  }

  async generateUniqueCode(
    type: string | number,
    append?: number | string
  ): Promise<string> {
    let code: string | PromiseLike<string>;

    while (true) {
      // 生成 6 位验证码（可能有前导零）
      code = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, '0');

      // 使用 Redis 保证不重复
      // 过期时间设置为 5 分钟（300 秒）
      const key = this.setKey(type, append);

      const result = await this.redisService.set(key, code);
      if (result === 'OK') {
        await this.redisService.expire(key, 60); // 设置过期时间
        break; // 成功存储，不重复，可以用
      }
      // 如果 result !== OK，说明这个验证码已存在，重新生成
    }

    return code;
  }

  setKey(type: string | number, append?: number | string) {
    return `sms_code:${type}${append !== '' ? ':' + append : ''} `;
  }
}
