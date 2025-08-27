// src/guard/jwt.guard.ts
import {
  Guard,
  IGuard,
  getPropertyMetadata,
  httpError,
  Inject,
} from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { JwtService } from '@midwayjs/jwt';
import { IGNORE_AUTH_KEY } from '../decorator/ignoreAuth';
import { IObjectKeys } from '../interface/user';

@Guard()
export class JwtGuard implements IGuard<Context> {
  @Inject()
  jwtService: JwtService;

  async canActivate(
    ctx: Context,
    supplierClz: any,
    methodName: string
  ): Promise<boolean> {
    // 1) 先看方法上有没有 IgnoreAuth 标记
    const ignore = getPropertyMetadata<boolean>(
      IGNORE_AUTH_KEY,
      supplierClz,
      methodName
    );
    if (ignore) {
      return true; // 跳过鉴权
    }

    // 2) 常规 JWT 校验（把你原中间件的逻辑搬到这里）
    const authHeader =
      ctx.get?.('authorization') || ctx.headers['authorization'];
    if (!authHeader) {
      throw new httpError.UnauthorizedError();
    }
    const parts = ctx.get('authorization').trim().split(' ');

    if (parts.length !== 2) {
      throw new httpError.UnauthorizedError();
    }

    const [scheme, token] = parts;
    if (/^Bearer$/i.test(scheme)) {
      //jwt.verify方法验证token是否有效
      const user: any = await this.jwtService.verify(token, {
        complete: true,
      });
      if (user) {
        ctx.user = user?.payload as IObjectKeys;
        return true;
      } else {
        throw new httpError.UnauthorizedError();
      }
    }
  }
}
