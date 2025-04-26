
const { Client } = require('pg');

const con = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "mouhanned2002",
    database: "pfe_oumaima"
});

module.exports = con;
