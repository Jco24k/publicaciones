import { DataSource, FindManyOptions, FindOptionsWhere } from 'typeorm';

export interface IOPtionsPostAndPut<R, T> {
    def: any;
    jwt: string;
    request_body: R;
    entity: { new(): T };
    dataSource?: DataSource;
    criterionWhere?: FindManyOptions<T>;
    statusCode?: number;
    fk?: boolean;
    param?: number;
}
export interface IOPtionsGet<T, R> {
    def: any;
    entity: { new(): T };
    statusCode?: number;
    dataSource?: DataSource;
    queryParams?: R;
    filter?: FindManyOptions<T>;
}
export interface IOPtionsGetAndDelete<T> {
    def: any;
    jwt: string;
    entity: { new(): T };
    statusCode?: number;
    dataSource?: DataSource;
    search_id: number;
    addWhere?: FindOptionsWhere<T>;
}
export const toJson = (data: any) => {
    return JSON.parse(JSON.stringify(data));
};