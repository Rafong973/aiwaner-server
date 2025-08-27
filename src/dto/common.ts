import { Rule, RuleType } from '@midwayjs/validate';

export const requiredString = RuleType.string().required();
export const requiredNumber = RuleType.number().required();

export class smsDto {
  @Rule(RuleType.number().required())
  mobile: number;

  @Rule(RuleType.number().required())
  type: number;
}

export class idDto {
  @Rule(RuleType.number().required())
  id: number;
}

export class userIdDto {
  @Rule(RuleType.number().required())
  userId: number;
}

export class pageDto {
  @Rule(RuleType.number().allow(''))
  pageNum: number;

  @Rule(RuleType.number().allow(''))
  pageSize: number;

  @Rule(RuleType.number().allow(''))
  total: number;

  getPageNum(): number {
    return this.pageNum || 1;
  }

  getPageSize(): number {
    return this.pageSize || 10;
  }

  getLimit(): number {
    return this.getPageSize() * (this.getPageNum() > 0 ? 1 : 0);
  }

  getOffset(): number {
    return this.getPageNum() > 0
      ? (this.getPageNum() - 1) * this.getPageSize()
      : 0;
  }
}
