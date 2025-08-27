import * as CryptoJS from 'crypto-js';
import { Provide, App, Inject } from '@midwayjs/core';
import { Application, Context } from '@midwayjs/koa';
import * as crypto from 'crypto';

@Provide()
export class SecretService {
  @Inject()
  ctx: Context;

  @App()
  app: Application;

  getKey(): any {
    const secretConfig = this.app.getConfig('secret');
    return CryptoJS.enc.Utf8.parse(secretConfig.key);
  }
  getOptions(): { mode: any; padding: any; iv: any } {
    const secretConfig = this.app.getConfig('secret');
    const iv = CryptoJS.enc.Utf8.parse(secretConfig.iv);
    return {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv,
    };
  }
  /**
   * 加密方法
   * @param data
   * @returns {string}
   */
  encrypt(data: object | string): string {
    if (typeof data === 'object') {
      data = JSON.stringify(data);
    }
    const message = CryptoJS.enc.Utf8.parse(data);

    const encrypted = CryptoJS.AES.encrypt(
      message,
      this.getKey(),
      this.getOptions()
    );
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  }

  /**
   * 解密方法
   * @param data
   * @returns {string}
   */
  decrypt(data: string): any {
    const encryptedHexStr = CryptoJS.enc.Base64.parse(data);
    const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    const decrypted = CryptoJS.AES.decrypt(
      srcs,
      this.getKey(),
      this.getOptions()
    );
    const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
  }

  md5(data: string): string {
    const hash = crypto.createHash('md5');
    return hash.update(data, 'utf8').digest('hex');
  }
}
