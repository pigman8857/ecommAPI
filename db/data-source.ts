import { DataSource, DataSourceOptions } from "typeorm"

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'ecomm_admin',
  password: '',
  database: 'ecomm',
  entities: [],
  migrations: [],
  logging: false,
  synchronize: false,
};