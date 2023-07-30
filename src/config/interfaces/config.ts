export interface Config {
  database: {
    host: string;
    username: string;
    password: string;
    port: number;
    database: string;
  };
  query: {
    page_number: number;
    page_size: number;
    min_page: 1;
  };
  jwt: {
    secret: string;
    expire: string;
  };
}
