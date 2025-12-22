# **Projeto Java – Interface com Javax Swing + Consumo de API REST com Node.js** # 
-------------------------------------------------------------------------------------------------

 ## __Descrição do Projeto__ ##  

Este projeto tem como objetivo demonstrar a integração entre uma API RESTful desenvolvida em Node.js e uma aplicação cliente desenvolvida em Java, responsável por consumir dados disponibilizados pelo servidor via protocolo HTTP. A comunicação entre as aplicações ocorre por meio do formato JSON, permitindo a troca de informações de forma padronizada e independente de linguagem.

### _Objetivos do Projeto_ ###
- Compreender o funcionamento de uma API REST
- Consumir dados externos em uma aplicação Java
- Aplicar conceitos de arquitetura em camadas
- Separar responsabilidades entre Model, Service e Main
- Integrar tecnologias distintas em um mesmo ecossistema

- _Tecnologias Utilizadas_ ( __Projeto DataBase__ )
  - Back-end
  - Node.js
  - Express
  - CORS
  - JSON
- _Cliente_
  - Java (JDK 11+)
  - HttpClient
  - Visual Studio Code

-----------------------------------------------------------------------------------------

## __Arquitetura do Projeto__ ##

* ***/src/br/com/interface/***       

**App** | **Model** | **Service**| **View** | 
--- | --- | --- | --- 
_Main_ | _Curso_ | _CursoService_ | _CursoView_

-----------------------------------------------------------------------------------------

## **Descrição das Classes** ##

### _Classe Main ( App )_ ###
A classe Main representa o ponto de entrada da aplicação. Sendo responsável por : 
1. Inicializar o serviço
2. Executar a chamada à API
3. Receber a lista de cursos
4. Exibir os dados ao usuário
5. Tratar possíveis exceções

### _Classe Curso (Model)_ ###

A classe Curso representa a entidade de domínio do sistema. Ela reflete a estrutura do objeto JSON retornado pela API.

* Atributos principais ( __Constructor__ ) :
  * codigo
  * curso
  * periodo
  * ano

### _Classe CursoService (Service)_ ###

A classe CursoService é responsável por realizar a comunicação com a API REST.

- Funcionalidades principais:
  - Criar requisições HTTP do tipo GET
  - Consumir o endpoint /cursos
  - Validar o código de resposta HTTP
  - Processar o JSON retornado
  - Converter os dados para objetos Curso

-----------------------------------------------------------------------------------------

## __Integração com a API Node.js__ ##

O servidor expõe o seguite endpoint: 
* **` console.log('Servidor executado em http://localhost:3000/cursos'); `**

* Fluxo de Comunicação
1. A aplicação ( Java ) envia uma requisição _HTTP_
2. O servidor Node.js consulta o banco de dados
3. Os dados são retornados em formato _JSON_
4. O java converte o JSON em objetos
5. As informações são exibidas

### _Estrutura do JSON_ ### 

```
  [{
    "codigo": 1,
    "curso": "ADS",
    "periodo": "Noturno",
    "ano": 2024
  }]
``` 

### _Exemplificação_ ##

* Bloco de código
  * **` HttpRequest request = HttpRequest.newBuilder(
    URI.create(URL)
).GET().build(); `**    

* Lista de Funcionalidades
  + [✅] Consumo de API REST
  + [✅] Requisição _HTTP GET_
  + [✅] Processamento de _JSON_
  + [✅] Arquitetura em camadas
  + [✅] Tratamento de Exceções

-----------------------------------------------------------------------------------------

## __Conclusão__ ##
Este projeto tem caráter educacional, sendo desenvolvido para demonstrar a integração entre aplicações distribuídas utilizando o padrão REST, reforçando conceitos fundamentais de desenvolvimento moderno e engenharia de software. Exclusivamente desenvolvido para fins acadêmicos e técnicos.
