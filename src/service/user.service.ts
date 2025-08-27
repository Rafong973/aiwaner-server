import { Provide, Inject, App } from '@midwayjs/core';
import { Context, Application } from '@midwayjs/koa';
import { IUserOptions } from '../interface';
import { JwtService } from '@midwayjs/jwt';
import { IObjectKeys } from '../interface/user';

@Provide()
export class UserService {
  @App()
  app: Application;

  @Inject()
  ctx: Context;

  @Inject()
  jwt: JwtService;
  async getUser(options: IUserOptions) {
    return {
      uid: options.uid,
      username: 'mockedName',
      phone: '12345678901',
      email: 'xxx.xxx@xxx.com',
    };
  }

  // 设置新的Token
  async setToken(user: IObjectKeys): Promise<string> {
    const config = this.app.getConfig();
    console.log(user);
    const jwt = await this.jwt.sign(
      JSON.parse(JSON.stringify(user)),
      config.jwt.secret,
      {
        expiresIn: config.jwt.sign.expiresIn,
      }
    );
    this.ctx.set('Authorization', jwt);
    return jwt;
  }
}
