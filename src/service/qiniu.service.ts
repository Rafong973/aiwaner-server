import { App, Init, Provide } from '@midwayjs/core';
import { Application } from '@midwayjs/koa';
import * as qiNiu from 'qiniu';

@Provide()
export class QiNiuService {
  mac: qiNiu.auth.digest.Mac;

  @App()
  app: Application;

  @Init()
  init() {
    const config = this.app.getConfig('qiNiu');
    const accessKey = config.accessKey;
    const secretKey = config.secretKey;
    this.mac = new qiNiu.auth.digest.Mac(accessKey, secretKey);
  }

  getToken() {
    const config = this.app.getConfig('qiNiu');
    const options = {
      scope: config.bucket,
      expires: 14400,
    };
    const putPolicy = new qiNiu.rs.PutPolicy(options);
    return {
      token: putPolicy.uploadToken(this.mac),
      domain: config.domain,
    };
  }
}
