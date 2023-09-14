import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export const createRequest =  async(app: INestApplication) => {
  return {
    post: async ({ url, body, jwt, query }: { url: string; body?: any; jwt?: string; query?: any }) => {
      const queryParams = new URLSearchParams(query);
      const headers = jwt ? { Authorization: `Bearer ${jwt}` } : {};
      const response = await request(app.getHttpServer())
        .post(`${url}${queryParams.toString() ? '?' + queryParams.toString() : ''}`)
        .send(body)
        .set(headers);
      return response;
    },
    getOne: async ({ url, jwt, search_id }: { url: string; jwt: string; search_id: string }) => {
      const response = await request(app.getHttpServer())
        .get(`${url}/${search_id}`)
        .set('Authorization', `Bearer ${jwt}`);
      return response;
    },
    patch: async ({ url, body, jwt, param }: { url: string; body?: any; jwt?: string; param: string }) => {
      const headers = jwt ? { Authorization: `Bearer ${jwt}` } : {};
      const response = await request(app.getHttpServer())
        .patch(`${url}/${param}`)
        .send(body)
        .set(headers);
      return response;
    },
    delete: async ({ url, jwt, search_id }: { url: string; jwt: string; search_id: string }) => {
      const response = await request(app.getHttpServer())
        .delete(`${url}/${search_id}`)
        .set('Authorization', `Bearer ${jwt}`);
      return response;
    },
    getAll: async ({ url, jwt, query }: { url: string; jwt?: string; query?: any }) => {
      const queryParams = new URLSearchParams(query);
      const headers = jwt ? { Authorization: `Bearer ${jwt}` } : {};
      const response = await request(app.getHttpServer())
        .get(`${url}${queryParams.toString() ? '?' + queryParams.toString() : ''}`)
        .set(headers);
      return response;
    },
  };
};