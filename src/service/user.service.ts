import { App, Inject, Provide } from '@midwayjs/core';
import { Application, Context } from '@midwayjs/koa';
import { JwtService } from '@midwayjs/jwt';
import { IObjectKeys } from '../interface/user';
import { User } from '../entity/user.entity';

@Provide()
export class UserService {
  @App()
  app: Application;

  @Inject()
  ctx: Context;

  @Inject()
  jwt: JwtService;
  async getUser(id: string | number) {
    const user = await User.findOne({
      where: { id },
    });
    const result = user.dataValues;
    if (result.password) {
      result.hasPass = true;
    }
    delete result.password;
    return result;
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
