import { Catch } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

@Catch()
export class DefaultErrorFilter {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async catch(err: Error, _ctx: Context) {
    // 所有的未分类错误会到这里
    let code = 500;

    if (err.message.toLowerCase().includes('unauthorized')) {
      code = 401;
    }
    console.log(code);
    return {
      success: false,
      code: code,
      msg: err.message,
    };
  }
}
