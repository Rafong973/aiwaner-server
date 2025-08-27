// src/decorator/ignoreAuth.ts
import { savePropertyMetadata } from '@midwayjs/core';

export const IGNORE_AUTH_KEY = 'decorator:ignore_auth';

export function IgnoreAuth(): MethodDecorator {
  return (target: any, propertyKey: string | symbol) => {
    // 保存到方法的 metadata（后面用 supplierClz + methodName 读取）
    savePropertyMetadata(IGNORE_AUTH_KEY, true, target, propertyKey);
  };
}
