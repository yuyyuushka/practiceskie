const Joi = require('joi');

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('production'),
  PORT: Joi.number()
    .default(3000),
  DATABASE_URL: Joi.string()
    .required()
    .description('Database connection string'),
  JWT_SECRET: Joi.string()
    .required()
    .description('JWT Secret key'),
  CORS_ORIGIN: Joi.string()
    .required()
    .description('CORS Origin'),
  API_RATE_LIMIT: Joi.number()
    .default(100)
}).unknown();

const { value: envVars, error } = envVarsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  database: {
    url: envVars.DATABASE_URL,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
  },
  cors: {
    origin: envVars.CORS_ORIGIN,
  },
  rateLimit: {
    max: envVars.API_RATE_LIMIT,
  }
};