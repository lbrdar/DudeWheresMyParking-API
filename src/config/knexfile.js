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
      host: 'sql11.freemysqlhosting.net',
      port: 3306,
      user: 'sql11180430',
      password: 'sihZ1l4k8B',
      database: 'sql11180430',
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
      host: 'sql11.freemysqlhosting.net',
      port: 3306,
      user: 'sql11180430',
      password: 'sihZ1l4k8B',
      database: 'sql11180430',
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