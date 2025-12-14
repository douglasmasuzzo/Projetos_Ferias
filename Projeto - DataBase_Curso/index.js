// criação do servidor principal

const express = require('express');
const cors = require('cors');
const cursoRoutes = require('./routes/cursoRoutes');
const app = express();

// middleware
app.use( cors() ); app.use( express.json() );

// rotas 
app.use('/cursos', cursoRoutes );

// servidor
app.listen( 3000, () => {
    console.log('Servidor executado em http://localhost:3000');
});