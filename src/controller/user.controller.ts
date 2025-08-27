import { Inject, Controller, Post, Body, Get } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';
import { User } from '../entity/user.entity';
import { RegisterDot, UserLoginDot } from '../dto/user';
import { SecretService } from '../service/secret.service';
import { IgnoreAuth } from '../decorator/ignoreAuth';
import { RedisService } from '@midwayjs/redis';
import { SmsService } from '../service/sms.service';

@Controller('/user')
export class APIController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Inject()
  smsService: SmsService;

  @Inject()
  secretService: SecretService;

  @Inject()
  redisService: RedisService;

  // 登录接口
  @Post('/login')
  @IgnoreAuth()
  async getUser(@Body() params: UserLoginDot) {
    // 验证码登录
    if (params.type.toString() === '1') {
      const codeKey = this.smsService.setKey(2, params.mobile);
      const code = await this.redisService.get(codeKey);
      if (!code || parseInt(code) !== parseInt(params.code))
        throw new Error('验证码错误或已过期');
      this.redisService.del(codeKey);
    }

    const user = await User.findOne({
      where: {
        mobile: params.mobile,
      },
    });
    if (!user) throw new Error('找不到该用户');
    const userData = user.dataValues;
    if (params.type.toString() === '2') {
      if (!userData.password)
        throw new Error('用户未设置密码，请使用验证码登录');
      const password = this.secretService.encrypt(params.password);
      if (password !== userData.password) {
        throw new Error('密码不正确');
      }
    }

    delete userData.password;
    const token = await this.userService.setToken(userData);
    return { user, token };
  }

  //注册接口
  @Post('/register')
  @IgnoreAuth()
  async createUser(@Body() params: RegisterDot) {
    const codeKey = this.smsService.setKey(1, params.mobile);
    const code = await this.redisService.get(codeKey);
    this.redisService.del(codeKey);
    if (!code || parseInt(code) !== parseInt(params.code))
      throw new Error('验证码错误或已过期');
    const has = await User.findOne({
      where: {
        mobile: params.mobile,
      },
    });
    if (has) throw new Error('用户已存在');
    const createResult = await User.create({
      mobile: params.mobile,
    });
    const token = await this.userService.setToken(createResult.dataValues);
    return { user: createResult, token };
  }

  @Get('/info')
  async getUserInfo() {
    console.log(this.ctx.user);
    return this.ctx.user;
  }
}
