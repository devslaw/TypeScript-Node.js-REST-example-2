require('dotenv').config();
module.exports = {
    "development": {
        "username": process.env.PG_USER,
        "password": process.env.PG_PASSWORD,
        "database": process.env.PG_DB,
        "host": 'localhost',
        "dialect": "postgresql"
    },
    "test": {
        "username": process.env.PG_USER,
        "password": process.env.PG_PASSWORD,
        "database": process.env.PG_DB,
        "host": 'localhost',
        "dialect": "postgresql"
    },
    "production": {
        "username": process.env.PG_USER,
        "password": process.env.PG_PASSWORD,
        "database": process.env.PG_DB,
        "host": 'localhost',
        "dialect": "postgresql"
    }
};
