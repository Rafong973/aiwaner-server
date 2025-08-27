import { MidwayConfig } from '@midwayjs/core';

const dataSourceConfig = {
  username: 'lin',
  password: 'guis123!@#',
  host: '106.55.145.179',
  port: 13306,
  encrypt: false,
  dialect: 'mysql',
  define: { charset: 'utf8' },
  timezone: '+08:00',
  // 格式化时间
  dialectOptions: {
    dateStrings: true,
    typeCast: true,
  },
  retry: {
    max: 3, // 尝试重连次数
  },
  // 本地的时候，可以通过 sync: true 直接 createTable
  sync: true,

  // 支持如下的扫描形式，为了兼容我们可以同时进行.js和.ts匹配️
  entities: [
    'entity', // 指定目录
    '../entity/*.entity.{j,t}s', // 通配加后缀匹配
  ],
};

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1756254717816_7701',
  koa: {
    port: 9001,
  },
  secret: {
    key: '1b3ad09e8265fc74',
    iv: '0102030405060708',
  },
  qiNiu: {
    accessKey: 'JwNmq8Y7n_UAaKe7wiMtE8oplkKQbtsp8a8qi9AT',
    secretKey: 'JDQkzbRdQb8pzHBWY3OEk_iLKVlNMjmnHh1YOAdb',
    bucket: 'dangan-public',
    domain: 'https://dangan-public-storage.jinhuishineng.cn',
  },
  jwt: {
    secret: 'aiwaner-project-8187283123', // fs.readFileSync('xxxxx.key')
    sign: {
      // signOptions
      expiresIn: '30d', // https://github.com/vercel/ms
    },
  },
  sequelize: {
    dataSource: {
      // 第一个数据源，数据源的名字可以完全自定义
      default: {
        database: 'aiwaner-test',
        ...dataSourceConfig,
      },
    },
  },
  // 过滤掉请求体中未定义字段
  validate: {
    validationOptions: {
      stripUnknown: true, // 全局生效
    },
  },
  redis: {
    client: {
      port: 6379, // Redis port
      host: '127.0.0.1', // Redis host
      password: 'rafong123',
      db: 0,
    },
  },
  axios: {
    default: {
      // 所有实例复用的配置
    },
    clients: {
      // 默认实例的配置
      default: {
        baseURL: 'https://apitest.jinhuishineng.cn/aireport',
        // `headers` are custom headers to be sent
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
        timeout: 600000, // default is `0` (no timeout)

        withCredentials: false, // default
      },
    },
  },
} as MidwayConfig;
