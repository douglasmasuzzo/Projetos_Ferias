# Projeto Node.js – API RESTful para Gerenciamento de Cursos (DataBase Curso) # 
-----------------------------------------------------------------------------------------------

## __Descrição do Projeto__ ## 

Este projeto tem como objetivo o desenvolvimento de uma API RESTful utilizando Node.js, responsável por realizar operações
de consulta e inserção de dados em um banco de dados MySQL, relacionados ao cadastro de cursos acadêmicos. 
A API segue o padrão REST, utilizando o protocolo HTTP para comunicação e o formato JSON para troca de dados, 
permitindo integração com aplicações clientes desenvolvidas em diferentes linguagens, como Java.

### _Objetivos do Projeto_ ## 
  - Implementar uma API RESTful com Node.js
  - Conectar e manipular dados em um banco de dados MySQL
  - Aplicar o conceito de separação de responsabilidades
  - Utilizar programação assíncrona com async/await
  - Garantir organização, escalabilidade e manutenção do código
  - Permitir consumo por aplicações externas (Java, Postman, Front-end)

- _Tecnologias Utilizadas ( Projeto DataBase Curso )_
  - Back-end
  - Node.js
  - Express
  - MySQL | mysql2
  - CORS
  - JSON

- _Ferramentas_
  - Postman (testes de requisição)
  - Visual Studio Code

------------------------------------------------------------------------------------------------------

## __Arquitetura do Projeto__ ## 

* ***/src/***

**Servidor** | **DataBase** | **Routes** | **Controller** |
--- | --- | --- | --- | 
_index.js_ | _db.js_ | _cursoRoutes.js_ | _cursoController.js_  

-----------------------------------------------------------------

## **Descrição dos Arquivos** ##

### _Arquivo index.js (Servidor Principal)_ ###
O arquivo index.js é responsável pela inicialização do servidor Node.js e configuração dos principais middlewares da aplicação.
Responsável por : 

1. Criar a instância do servidor Express
2. Configurar middlewares globais
3. Registrar as rotas da API
4. Inicializar o servidor HTTP

- **Middlewares utilizados**:
  
  - _`cors()`_
    - Permite acesso à API por aplicações externas

  - _`express.json()`_
    - Realiza o parsing de requisições JSON

  - *`Header Content-Type`*
    - Define o padrão de resposta como JSON UTF-8

- Endpoint inicial do servidor:

 - **` http://localhost:3000/cursos `**

### *Arquivo db.js (Conexão com o Banco de Dados)* ###
O arquivo db.js centraliza toda a conectividade com o banco de dados MySQL. Caracterizado por : 

1. Utiliza *` mysql2.createPool() `*
2. Implementa o conceito de Connection Pool
3. Exporta conexões utilizando Promises

A utilização de _`.promise()`_ permite o uso da sintaxe **_`async/await`_** , tornando o código mais legível e moderno.

### _Arquivo cursoRoutes.js (Rotas da API)_ ###
O arquivo cursoRoutes.js é responsável pela definição dos endpoints da API, utilizando o _` express.Router() `_.

- *Rotas implementadas:*

  - *` GET /cursos `*
    - Lista todos os cursos

  - *` GET /cursos/periodo/:periodo `*
    - Lista cursos por período

  - *` POST /cursos `*
    - Insere um novo curso no banco de dados

Essa separação evita sobrecarregar o arquivo principal (index.js) e mantém o projeto organizado.

###*Arquivo cursoController.js (Controlador e Lógica de Negócio)*###
O arquivo cursoController.js contém a lógica de negócio da aplicação, sendo responsável por intermediar as requisições HTTP e o banco de dados.

- _Funcionalidades implementadas_:

  - _`listarCursos`_
    - Executa a consulta SELECT * FROM cursos, retornando todos os registros em formato JSON

  - _`listarPorPeriodo`_
    - Utiliza parâmetros de rota e permitindo filtragem dinâmica por período

  - _`criarCursos`_
    - Insere novos cursos no banco de dados e valida campos obrigatórios, retornando códigos HTTP adequados

- *Segurança*:
  - Uso de placeholders (?) nas consultas SQL
  - Prevenção contra SQL Injection

- _Tratamento de erros_:

1. **200** -> ( Requisição bem-sucedida )
2. **201** -> ( Curso cadastrado com sucesso )
3. **400** -> ( Dados obrigatórios ausentes )
4. **500** -> ( Erros internos do servidor )

--------------------------------------------------------------------------------------------

## **Integração com Aplicações Cliente** ##

A API pode ser consumida por qualquer aplicação que suporte requisições HTTP através do Endpoint: 
 * **` http://localhost:3000/cursos `**

* Fluxo de Comunicação
1. O cliente envia uma requisição HTTP
2. O servidor Node.js recebe a solicitação
3. O banco de dados MySQL é consultado
4. Os dados são retornados em formato JSON
5. O cliente processa a resposta

### *Estrutura do JSON* ###
```
  [{
    "codigo": 1,
    "curso": "ADS",
    "periodo": "Noturno",
    "materias": 5,
    "horas": 320,
    "duracao": "2 anos",
    "ano": 2024
  }]
```
* Lista de Funcionalidades
  + [✅] API RESTful
  + [✅] Comunicação com MySQL
  + [✅] Requisições HTTP GET
  + [✅] Requisições HTTP POST
  + [✅] Filtro por parâmetros de rota
  + [✅] Programação assíncrona
  + [✅] Segurança contra SQL Injection
  + [✅] Tratamento de erros
    
-----------------------------------------------------------------
## **Conclusão** ##
Este projeto possui caráter educacional e técnico, sendo desenvolvido para demonstrar a construção de uma API RESTful com Node.js, 
integrando banco de dados MySQL e aplicando conceitos fundamentais de desenvolvimento back-end, arquitetura de software e sistemas distribuídos.
O projeto serve como base para integração com aplicações clientes, como sistemas Java, front-ends web ou ferramentas de teste como o Postman.
