import { Rule, RuleType } from '@midwayjs/validate';
import { requiredNumber, requiredString } from './common';

export class UserLoginDot {
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

export class RegisterDot {
  @Rule(requiredString)
  mobile: string;

  @Rule(requiredNumber)
  code: string;
}
