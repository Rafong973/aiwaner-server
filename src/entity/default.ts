import {
  Column,
  Model,
  Table,
  DataType,
  UpdatedAt,
  CreatedAt,
} from 'sequelize-typescript';
import * as moment from 'moment';

export const tableConfig = {
  underscored: true,
  paranoid: true,
  timestamps: true,
  freezeTableName: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
};

@Table({
  ...tableConfig,
  tableName: 'demo',
})

// 时间
export class Time extends Model {
  @Column({
    primaryKey: true, // 主键
    autoIncrement: true, // 自动递增
    type: DataType.BIGINT,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    defaultValue: '1', // 设置默认值
  })
  name: string;

  @Column({
    type: DataType.BIGINT,
    defaultValue: null,
  })
  updatedBy: number;
  @Column({
    type: DataType.BIGINT,
    defaultValue: null,
  })
  createdBy: number;

  // 自动维护的时间戳
  @CreatedAt
  @Column({
    type: DataType.DATE,
    get() {
      const rawValue = this.getDataValue('createdAt');
      return rawValue ? moment(rawValue).format('YYYY-MM-DD HH:mm:ss') : null;
    },
  })
  createdAt: Date | string;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    get() {
      const rawValue = this.getDataValue('updatedAt');
      return rawValue ? moment(rawValue).format('YYYY-MM-DD HH:mm:ss') : null;
    },
  })
  updatedAt: Date | string;
}
