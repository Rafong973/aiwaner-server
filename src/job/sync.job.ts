import { Job, IJob } from '@midwayjs/cron';
import { Inject } from '@midwayjs/core';
import { App } from '@midwayjs/core';
import { Application, Context } from '@midwayjs/koa';
import { SecretService } from '../service/secret.service';

// 定时任务
@Job('syncJob', {
  cronTime: '*/59 * * * *',
  start: true, // 是否启动
  runOnInit: true, // 运行时启动
})
export class DataSyncCheckerJob implements IJob {
  @App()
  app: Application;

  @Inject()
  secretService: SecretService;

  @Inject()
  ctx: Context;

  async onTick() {
    const env: string = this.app.getEnv();
    if (env !== 'local') {
      console.log(env + '环境：定时任务开始执行');
      this.ctx.logger.info(JSON.stringify(this.app.getConfig()));
      // 获取Token
    }
    console.log(this.secretService.encrypt('0192023a7bbd73250516f069df18b500'));
  }
}
