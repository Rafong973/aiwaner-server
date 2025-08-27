import { Table, Column, DataType, Model, Index } from 'sequelize-typescript';
import { tableConfig } from './default';
import * as moment from 'moment';
import { IObjectKeys } from '../interface/user';
import { Moment } from 'moment';

export interface UserAttributes {
  id: number;
  openid?: string;
  sex: number;
  nickName: string;
  mobile: string;
  avatarUrl: string;
  birthday: string | Moment;
  status: number;
  isMaster: number;
  city: string;
  allergy: string;
  allergens: string;
  allergicReactions: string;
  allergyLevel: number;
  familyGeneticHistory: string;
  chronic: string;
  remark: string;
  relation?: number;
  relationName?: string;
  password: string;
  vip?: Array<IObjectKeys>;
  updatedBy: number;
  createdBy: number;
  deletedAt: string | Moment | Date;
  updatedAt: string | Moment | Date;
  members: Array<IObjectKeys>;
  parents: Array<IObjectKeys>;
}

@Table({
  ...tableConfig,
  tableName: 'user',
  indexes: [
    {
      unique: true,
      fields: ['openid'],
    },
  ],
})
export class User extends Model {
  @Column({
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    type: DataType.BIGINT({ length: 20 }),
  })
  id: number;

  @Column({
    type: DataType.CHAR(50),
    allowNull: true,
  })
  openid: string;

  @Column({
    type: DataType.CHAR(100),
  })
  password: string;

  @Column({
    allowNull: true,
  })
  sex: number;

  @Column({
    type: DataType.CHAR({
      length: 20,
    }),
  })
  nickName: string;

  @Column({
    type: DataType.CHAR({
      length: 20,
    }),
  })
  userName: string;

  @Column({
    type: DataType.STRING,
    defaultValue:
      'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
  })
  avatarUrl: string;

  @Column({
    type: DataType.DATE,
    get() {
      const rawValue = this.getDataValue('birthday'); // 获取原始值
      return rawValue ? moment(rawValue).format('yyyy-MM-DD') : null;
    },
  })
  birthday: Date | Moment | string;

  // 账号状态
  @Column({
    type: DataType.INTEGER({
      length: 1,
    }),
    defaultValue: 1,
  })
  status: number;

  // 所在城市
  @Column({
    type: DataType.CHAR(10),
  })
  city: string;

  // 手机号码
  @Index({
    name: 'idx_user_mobile',
    unique: true,
  })
  @Column({
    type: DataType.CHAR(11),
    allowNull: false,
  })
  mobile: string;
}
