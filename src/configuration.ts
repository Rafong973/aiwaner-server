import { Configuration, App, IMidwayContainer } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import { join } from 'path';
import { Application } from '@midwayjs/koa';
import { InjectJob, CronJob } from '@midwayjs/cron';
import * as jwt from '@midwayjs/jwt';
import * as axios from '@midwayjs/axios';
import * as cron from '@midwayjs/cron';
import * as sequelize from '@midwayjs/sequelize';
// import { ReportMiddleware } from './middleware/report.middleware';
import { defineAssociations } from './entity/associations';
import { ResponseMiddleware } from './middleware/response.middleware';
import { DataSyncCheckerJob } from './job/sync.job';
import { NotFoundFilter } from './filter/notfound.filter';
import { DefaultErrorFilter } from './filter/default.filter';
import { InternalServerErrorFilter } from './filter/internal.filter';
import { SequelizeDataSourceManager } from '@midwayjs/sequelize';
import { JwtGuard } from './guard/jwt.guard';
import * as redis from '@midwayjs/redis';

@Configuration({
  imports: [
    koa,
    cron,
    validate,
    sequelize,
    jwt,
    axios,
    redis,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class MainConfiguration {
  @App('koa')
  app: koa.Application;

  @App()
  application: Application;

  // 定时任务
  @InjectJob(DataSyncCheckerJob)
  syncJob: CronJob;

  async onReady(container: IMidwayContainer) {
    //   同步所有模型
    const dataSourceManager = await this.app
      .getApplicationContext()
      .getAsync(SequelizeDataSourceManager);
    const seq = dataSourceManager.getDataSource('default');
    await seq.authenticate();

    // 关联模型关系
    defineAssociations();

    // add middleware
    this.app.useMiddleware([ResponseMiddleware]);

    this.app.useGuard(JwtGuard);
    // add filter
    this.app.useFilter([
      NotFoundFilter,
      DefaultErrorFilter,
      InternalServerErrorFilter,
    ]);

    // 配置外部请求
    const httpService = await container.getAsync(axios.HttpService);
    httpService.interceptors.request.use(
      config => {
        return config;
      },
      error => {
        // Do something with request error
        return Promise.reject(error);
      }
    );
    httpService.interceptors.response.use(
      response => {
        if (response.status === 200) {
          return response?.data || response;
        } else {
          return Promise.reject(response);
        }
      },
      error => {
        console.log('报错了', error);
        return Promise.reject(error);
      }
    );
  }
}
