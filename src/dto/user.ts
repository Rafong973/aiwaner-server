import { Rule, RuleType } from '@midwayjs/validate';
import { requiredNumber, requiredString } from './common';

export class UserLoginDto {
  // 登录类型： 1是验证码 ； 2是密码
  @Rule(RuleType.alternatives(requiredNumber, requiredString))
  type: number;

  @Rule(RuleType.alternatives(requiredNumber, requiredString))
  mobile: string;

  @Rule(
    RuleType.alternatives(
      RuleType.string().allow(''),
      RuleType.number().allow('')
    )
  )
  code?: string;

  @Rule(RuleType.string())
  password?: string;
}

export class RegisterDto {
  @Rule(requiredString)
  mobile: string;

  @Rule(requiredNumber)
  code: string;
}

export class updateInfoDto {
  @Rule(RuleType.string().allow('').allow(null))
  avatarUrl?: string;

  @Rule(RuleType.string().allow('').allow(null))
  area?: string;

  @Rule(RuleType.string().allow('').allow(null))
  nickName?: string;

  @Rule(RuleType.string().allow('').allow(null))
  address?: string;

  @Rule(RuleType.string().allow('').allow(null))
  profile?: string;
}
