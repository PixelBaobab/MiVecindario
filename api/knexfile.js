// Update with your config settings.

try {
  require("babel-register");
  require("babel-polyfill");
} catch(e) {
  // it's ok. might be already enabled
}

module.exports = {

  development: {
    client: 'pg',
    connection: {
      host     : 'localhost',
      user     : 'mi_vecindario',
      password : 'mi_vecindario',
      database : 'mi_vecindario',
      charset  : 'utf8'
    },
    pool: {
      min: 2,
      max: 10,
      ping: function (conn, cb) {
        conn.query('SELECT 1', cb);
      }
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'pg',
    connection: {
      host      : process.env.PG_HOST,
      database  : process.env.PG_DB,
      user      : process.env.PG_USER,
      password  : process.env.PG_PASSWORD,
      charset   : 'utf8'
    },
    pool: {
      min: 2,
      max: 10,
      ping: function (conn, cb) {
        conn.query('SELECT 1', cb);
      }
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
