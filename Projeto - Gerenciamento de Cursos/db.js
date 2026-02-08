// centraliza a conexão com o MySQL

// database.js
const mySQL = require('mysql2');

// cria um pool de conexões ( POOL : cache de conexões de databases )
const pool = mySQL.createPool( 
    {
        host : 'localhost',
        user: 'root', 
        password : '',
        database: 'cadastro'
    }
);

module.exports = pool.promise();