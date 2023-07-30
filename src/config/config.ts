import { registerAs } from '@nestjs/config';
import { Config } from './interfaces/config';

export default registerAs(
  'config',
  (): Config => ({
    database: {
      database: process.env.DB_DATABASE,
      host: process.env.DB_HOST,
      password: process.env.DB_PASS,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
    },
    jwt: {
      expire: process.env.JWT_EXPIRE,
      secret: process.env.JWT_SECRET,
    },
    query: {
      page_number: +process.env.PAGE_NUMBER || 1,
      page_size: +process.env.PAGE_SIZE || 10,
      min_page: 1,
    },
  }),
);
