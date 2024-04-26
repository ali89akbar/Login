const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "Shoe",
    password: "12345", // Make sure to replace this with your actual password
    port: 5432,
});

pool.connect((err) => {
    if (err) throw err;
    console.log("Connected successfully to PostgreSQL");
});

module.exports = pool;
