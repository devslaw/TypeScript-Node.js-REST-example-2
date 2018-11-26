import * as Sequelize from 'sequelize';

export const sequelize = new Sequelize(process.env.PG_DB, process.env.PG_USER,  process.env.PG_PASSWORD, {
    host:  process.env.PG_HOST,
    dialect: 'postgres',
    operatorsAliases: false,
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });