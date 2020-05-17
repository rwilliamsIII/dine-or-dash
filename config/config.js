require('dotenv').config();
module.exports = {
  "development": {
    "username": process.env.username,
    "password": process.env.password,
    "database": process.env.database,
    "host": process.env.host,
    "port": process.env.port,
    "dialect": process.env.dialect
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "port": 3306,
    "dialect": "mysql"
  },
  "production": {
    "username": JAWS_USERNAME,
    "password": JAWS_PASSWORD,
    "database": JAWS_DATABASE,
    "host": JAWS_HOST,
    "port": JAWS_HOST,
    "dialect": JAWS_DIALECT
  }
};