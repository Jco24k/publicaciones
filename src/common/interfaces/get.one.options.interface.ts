import { FindOptionsWhere } from 'typeorm';

export interface GetOneOptions<T> {
  where: FindOptionsWhere<T> | FindOptionsWhere<T>[];
  error?: boolean;
  relations?: boolean;
}
