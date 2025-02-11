import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PG_DATABASE_HOST: Joi.string().required(),
  PG_DATABASE_PORT: Joi.number().default(5432),
  PG_DATABASE_USER: Joi.string().required(),
  PG_DATABASE_PASSWORD: Joi.string().required(),
  PG_DATABASE_NAME: Joi.string().required(),
});
