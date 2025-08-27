// src/filter/internal.filter.ts
import { Catch, httpError, MidwayHttpError } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

@Catch(httpError.InternalServerErrorError)
export class InternalServerErrorFilter {
  async catch(err: MidwayHttpError, ctx: Context) {
    // ...
    ctx.logger.error(err);
    return 'got 500 error, ' + err.message;
  }
}
