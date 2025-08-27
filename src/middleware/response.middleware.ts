import { Middleware, IMiddleware } from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';

@Middleware()
export class ResponseMiddleware implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const result = await next();
      if (result === null) {
        ctx.status = 200;
      }
      if (typeof result === 'object' && 'rows' in result) {
        return { code: 200, msg: 'OK', ...result, rows: result.rows || [] };
      }
      return {
        code: 200,
        msg: 'OK',
        data: result,
      };
    };
  }

  match(ctx: Context) {
    // console.log(ctx.path.indexOf('/system') !== -1);
    return ctx.path.indexOf('/system') === -1;
  }
}
