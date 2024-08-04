import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/user-entity';
import { Role } from './entities/role-entity';

export const dataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  dropSchema: true,
  entities: [User, Role],
  synchronize: true,
  logging: false,
});

beforeAll(async () => {
  await dataSource.initialize();
});

afterAll(async () => {
  await dataSource.destroy();
});

beforeEach(async () => {
  await dataSource.synchronize(true);
});
