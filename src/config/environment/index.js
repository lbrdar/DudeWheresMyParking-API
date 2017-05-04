import knexfile from '../knexfile';

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 8080
};

// Append knex file config
config.knex = knexfile[config.env];

export default config;
