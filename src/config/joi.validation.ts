import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  DB_USER: Joi.required(),
  DB_PASS: Joi.required(),
  DB_HOST: Joi.required(),
  DB_PORT: Joi.required(),
  DB_DATABASE: Joi.required(),
  JWT_SECRET: Joi.required(),
  JWT_EXPIRE: Joi.required(),
});
