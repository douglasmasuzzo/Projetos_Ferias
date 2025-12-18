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
    console.log('Servidor executado em http://localhost:3000/cursos');
});

// NODE.JS SERVIDOR = http://localhost:3000
// MYSQL SERVIDOR = localhost:3306
// POSTMAN = GET http://localhost:3000/cursos 


/*
 Este projeto implementa uma API RESTFUL utilizando o Node.js, Express e MySQL. A arquitetura segue o padrão de separação de responsabilidade, facilitando a manutenção e escalabilidade. 

    -> DB.js ( Conectividade e Pool de Conexões )

     -- Conceito de ' CONNECTION POOL ' 
      + Em vez de abrir e fechar uma conexão para cada requisição ( o que é custoso ao servidor ), o código utiliza " mysql12.createPool() ". Isso mantém um conjunto de conexões prontas para o uso, melhorando a performance em ambientes de múltiplos usuários.
      
     -- Programação Assíncrona ' PROMISES '
      + O uso de " .promise() " permite que o projeto utilize a síntaxe  " async / await ". Isso evita o " CALLBACK HELL " e torna o código mais legível e moderno.
     
    -> INDEX.js ( Servidor e Middlewares )

     -- Express Framework
      + Utilizado para gerenciar rotas e ciclos de vida das requisições em HTTP

     -- CORS ( Cross Origin Resource Sharing )
      + O middleware ' cors() ' é fundamental para permitir que aplicações front-end ( REACT | VUE ) acessam a API de domínios diferentes 

     -- Parsing de JSON 
      + O comando ' express.json() ' é um middleware que traduz o corpo de requisições ( body ) de texto bruto para objetos em JavaScript, permitindo que acesse o ' req.body() '.

    -> cursoRoutes.js ( Roteamento Express )

     -- Separação de Consenso 
      + Em vez de colcoar todas as rotas no ' index.js ', o uso de " express.Router() " organiza os endereços da API. Isso permite que o código cresça de forma organizada
      
     -- Comandos
      + GET : recuperação de dados 
      + POST : criação de novos recursos 

    -> cursoController.js ( Controladores e Lógica de Negócio )

     -- Funcionalidades Implementadas

      - " listarCursos "
       + executa o comando " SELECT * " retornando todos os registros

      - " listarPorPeriodo "
       + demonstra o uso de parâmetros de rotas, permitindo busca dinâmicas 

     -- Segurança contra SQL Injection
      + observe que as consultas utilizam o caracter ( placeholder ), garantindo que os dados enviados pelo usuário sejam tratados como texto, impedindo ataques maliciosos que executam comandos SQL 

     -- Tratamento de Erros 
      
      - 201 ( CREATED )
       + retorna após um cadastro bem sucedido

      - 400 ( BAD REQUEST )
       + utilizado quando dados obrigatórios estão ausente

      - 500 ( INTERNAL SERVER ERROR )
       + um bloco ' try / catch ' captura falhas inesperadas e informa o erro.
*/