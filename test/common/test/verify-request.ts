import { HttpStatus } from '@nestjs/common';
import { IOPtionsGet, IOPtionsGetAndDelete, IOPtionsPostAndPut, toJson } from './interfaces/request-interface';


export const verifyRequest = {
    simplePostAndPut: async <R, T>({
        def: funPost,
        jwt,
        request_body,
        entity,
        dataSource,
        criterionWhere,
        statusCode = HttpStatus.CREATED,
        fk = false,
        param,
    }: IOPtionsPostAndPut<R, T>): Promise<T> => {
        const { body, status } = await funPost({
            body: toJson(request_body),
            jwt,
            param,
        });
        let exists: T;
        if (status !== statusCode) {
            console.log(request_body);
            console.log(body);
        }
        if (statusCode === HttpStatus.CREATED || statusCode === HttpStatus.OK) {
            exists = await dataSource.getRepository(entity).findOne(criterionWhere);
            expect(exists).toBeInstanceOf(entity);
            if (!fk) expect(body).toMatchObject(toJson(request_body));
            expect(body.company).toBeUndefined();
        }
        expect(status).toBe(statusCode);
        return exists;
    },
    simpleGetOneAndDelete: async <T>({
        def: funGet,
        jwt,
        entity,
        search_id,
        dataSource,
        statusCode = HttpStatus.OK,
        addWhere,
    }: IOPtionsGetAndDelete<T>): Promise<void> => {
        const { status } = await funGet({
            jwt,
            search_id,
        });
        if (statusCode === HttpStatus.OK) {
            const exists = await dataSource.getRepository(entity).exist({
                where: { id: search_id, ...addWhere },
            } as T);
            expect(exists).toBe(true);
        }
        expect(status).toBe(statusCode);
    },

    simpleGetAll: async <T, R>({
        def: funGet,
        entity,
        dataSource,
        statusCode = HttpStatus.OK,
        queryParams,
        filter,
    }: IOPtionsGet<T, R>): Promise<T[]> => {
        const { body, status } = await funGet({
            queryParams,
        });
        if (statusCode === HttpStatus.OK) {
            const exists = await dataSource.getRepository(entity).find(filter);
            if (body.length !== exists.length)
                console.log(exists)

            expect(body.length).toBe(exists.length);
            expect(body).toStrictEqual(toJson(exists));
        }
        expect(status).toBe(statusCode);
        return body;
    },
};