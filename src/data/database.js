import knex from 'knex';
import config from '../config/environment';

export default knex(config.knex);