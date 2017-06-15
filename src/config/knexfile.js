module.exports = {

  development: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'root',
      database: 'parking',
      dateStrings: true
    }
  },


  staging: {  // FIXME: use different setup in staging
    client: 'mysql',
    connection: {
      host: 'sql8.freemysqlhosting.net',
      port: 3306,
      user: 'sql8180448',
      password: 'cF55RVfTcq',
      database: 'sql8180448',
      dateStrings: true,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'mysql',
    connection: {
      host: 'sql8.freemysqlhosting.net',
      port: 3306,
      user: 'sql8180448',
      password: 'cF55RVfTcq',
      database: 'sql8180448',
      dateStrings: true,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};