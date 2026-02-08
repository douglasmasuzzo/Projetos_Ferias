# **PROJETO - MONITORAMENTO DE BATERIA EM PYTHON** #

## Descrição do Projeto ##
 Projeto desenvolvido com foco em monitoramento, coleta, persistência e visualização do estado da bateria do sistema, utilizando Python e boas práticas de arquitetura de software. Este projeto tem como objetivo estudar e aplicar conceitos de arquitetura em camadas, integração com Banco de Dados MySQL e construção de interfaces gráficas em Python, simulando um cenário próximo ao ambiente profissional.

### _Objetivos_ ###

 - Coletar informações periódicas da bateria do dispositivo
 - Aplicar arquitetura em camadas
 - Integrar Python com Banco de Dados Relacional
 - Utilizar variáveis de ambiente 
 - Persistência de Dados
 - Exibir informações através da Interface Gráfica


### _Tecnologias_ ##
 
 - Python 3.13.9
 - Tkinter ( UI )
 - PyMySQL ( acesso ao DB )
 - MySQL Workbench
 - python-dotenv ( gerenciamento de variáveis de ambientes )
 - GitHub 

-------------------------------------------------------------------

## Arquitetura do Projeto ##

 - _``core/battery.py``_
    - Acessa o hardware e formata os dados da bateria

 - _``core/models.py``_
    - Define a classe de dados ``RegistroBateria``

 - _``db/connection.py``_
    - Gerencia a conexão com o banco via ``create pool`` e variáveis ``.env``

 - _``db/repository.py``_
    - Executa comandos _SQL (INSERT)_ para salvar os registros 

 - _``ui/app.py``_
    - Executa a camada de apresentação

 - _``main.py``_
    - Ponto de entrada da aplicação


## Descrição de Componentes ##

 ### _Coleta de Dados ( ``battery.py`` )_ ###
  - Utiliza a função ``status`` para extrair informações do sistema. Trata-se de casos onde o tempo restante é indefinido ( retornando -1 ) e gera um dicionário com o ´´timestamp´´ atual.

 ### _Modelo de Dados ( ``models.py`` )_ ###
  - A classe ``RegistroBateria`` serve como um contrato de dados, garantindo que o objeto possua os atributos necessários : ``percent`` , ``plugged`` , ``running_time`` e ``timestamp``.

 ### _Persistência ( ``repository.py`` )_ ###
  - Implementa a lógica de inserção na tabela analise_bateria. Utiliza Placeholders (%s) para prevenir ataques de SQL Injection, garantindo que os dados do objeto sejam gravados corretamente.

 ### _Segurança e Configuraça ( ``connection.py`` )_ ###
  - A conexão é parametrizada via arquivo .env, protegendo informações sensíveis como ``DB_PASSWORD`` e ``DB_HOST``. O uso do ``DictCursor`` permite que os resultados sejam manipulados como dicionários Python.

## Integração ao Banco de Dados ##
 O banco de dados armazena os registros de monitoramento da bateria, com informações como:

 - Data e Hora da coleta
 - Percentual da carga
 - Status de conexão à energia
 - Duração estimada de execução

 ### _Estrutura : ``bateria.analise_bateria``_ ###

 ```
    CREATE TABLE `analise_bateria` (
        `id` int NOT NULL AUTO_INCREMENT,
        `timestamp` datetime NOT NULL,
        `percent` int NOT NULL,
        `plugged` tinyint(1) NOT NULL,
        `running_time` int NOT NULL,
        PRIMARY KEY (`id`)
    ) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
 ```
 As constraints **PRIMARY KEY | NOT NULL | AUTO_INCREMENT** são definidas diretamente no banco, garantindo integridade dos dados.

-------------------------------------------------------------

## Conclusão ##
 Este projeto representa um exercício prático completo de desenvolvimento em Python, indo além de scripts isolados e aproximando-se de um sistema real, com arquitetura definida, integração com banco de dados e interface gráfica. Ele serve como base sólida para projetos futuros mais complexos e como material de estudo para boas práticas em desenvolvimento de software.