# **PROJETO - MONITORAMENTO DE BATERIA EM PYTHON** #

## Descrição do Projeto ##
 Projeto desenvolvido com foco em monitoramento, coleta, persistência e visualização do estado da bateria do sistema, utilizando Python e boas práticas de arquitetura de software. Este projeto tem como objetivo estudar e aplicar conceitos de arquitetura em camadas, integração com Banco de Dados MySQL e construção de interfaces gráficas em Python, simulando um cenário próximo ao ambiente profissional.

### _Objetivos_ ###

 - Coletar informações periódicas da bateria do dispositivo
 - Aplicar arquitetura em camadas
 - Integrar Python com Banco de Dados Relacional
 - Utilizar variáveis de ambiente 
 -# Monitoramento de Bateria

> Projeto Python para monitoramento, coleta, persistência e visualização do estado da bateria do sistema, com arquitetura em camadas, persistência Dual-Write (MySQL + Supabase) e interface gráfica com atualização automática.

---

## Descrição

Desenvolvido como exercício prático de arquitetura de software, este projeto integra coleta de dados de hardware, persistência simultânea em banco local e em nuvem, e uma interface gráfica funcional — simulando um cenário próximo ao ambiente profissional.

---

## Objetivos

- Coletar informações periódicas da bateria do dispositivo
- Aplicar arquitetura em camadas
- Integrar Python com banco de dados relacional local (MySQL) e em nuvem (Supabase)
- Implementar o padrão **Dual-Write** para persistência simultânea e redundante
- Utilizar variáveis de ambiente para proteção de credenciais
- Exibir informações através de interface gráfica com atualização automática

---

## Tecnologias

| Tecnologia | Finalidade |
|---|---|
| Python 3.13 | Linguagem principal |
| Tkinter | Interface gráfica (UI) |
| psutil | Leitura de dados da bateria |
| PyMySQL | Acesso ao banco MySQL local |
| supabase-py | Acesso ao banco Supabase (nuvem) |
| python-dotenv | Gerenciamento de variáveis de ambiente |
| MySQL Workbench / XAMPP | Administração local do banco |
| Supabase Dashboard | Administração do banco em nuvem |
| GitHub | Versionamento de código |

---

## Arquitetura do Projeto

```
Projeto - Monitoramento de Bateria/
│
├── core/
│   ├── battery.py            # Coleta e formata dados da bateria
│   └── models.py             # Classe de dados RegistroBateria
│
├── db/
│   ├── connection_mysql.py   # Conexão com o MySQL via .env
│   ├── connection_supabase.py# Cliente Supabase via .env
│   └── repository.py         # Dual-Write: INSERT no MySQL e Supabase
│
├── ui/
│   └── app.py                # Interface gráfica com atualização automática
│
├── config/
│   └── .env                  # Credenciais (não versionado)
│
├── main.py                   # Ponto de entrada da aplicação
└── requirements.txt
```

---

## Descrição dos Componentes

### `core/battery.py` — Coleta de Dados
Utiliza `psutil.sensors_battery()` para extrair informações do hardware. Trata casos onde o tempo restante é indefinido (`POWER_TIME_UNKNOWN`) retornando `-1`, e calcula uma estimativa de descarga com base na variação percentual entre leituras consecutivas.

### `core/models.py` — Modelo de Dados
A classe `RegistroBateria` serve como contrato de dados, garantindo que o objeto possua os atributos `percent`, `plugged`, `running_time` e `timestamp`.

### `db/connection_mysql.py` — Conexão MySQL
Parametrizada via `.env`, protegendo `DB_PASSWORD` e `DB_HOST`. Lança `ValueError` descritivo caso as variáveis obrigatórias não estejam configuradas. Utiliza `DictCursor` para resultados como dicionários Python.

### `db/connection_supabase.py` — Conexão Supabase
Inicializa o cliente Supabase com `SUPABASE_URL` e `SUPABASE_KEY` obtidos do `.env`. Lança `ValueError` com mensagem descritiva caso as variáveis não estejam presentes.

### `db/repository.py` — Persistência Dual-Write
Implementa o padrão **Dual-Write**: cada chamada a `salvar_registro()` tenta inserir o registro no Supabase e no MySQL de forma **independente**. A falha em um banco não impede a gravação no outro. Retorna um dicionário `{"supabase": bool, "mysql": bool, "erros": [...]}`. O `timestamp` é serializado via `.isoformat()` para compatibilidade com JSON no Supabase.

### `ui/app.py` — Interface Gráfica
Construída com Tkinter/ttk. Exibe carga, status de conexão e tempo restante estimado. Atualiza os dados automaticamente a cada **60 segundos** via `root.after()`, sem bloquear a interface. O botão "Atualizar" permite coleta manual. O label de sincronização exibe o resultado do Dual-Write em verde (sucesso) ou vermelho (falha parcial ou total).

---

## Banco de Dados

### Estrutura: `analise_bateria`

Utilizada em ambos os bancos com a mesma estrutura:

```sql
CREATE TABLE analise_bateria (
    id           INT NOT NULL AUTO_INCREMENT,
    timestamp    DATETIME NOT NULL,
    percent      INT NOT NULL,
    plugged      TINYINT(1) NOT NULL,
    running_time INT NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

As constraints `PRIMARY KEY`, `NOT NULL` e `AUTO_INCREMENT` garantem integridade dos dados diretamente no banco.

### Padrão Dual-Write

Cada registro é enviado simultaneamente para:
- **MySQL** — banco local gerenciado via XAMPP
- **Supabase** — banco em nuvem com acesso via API REST

As operações são independentes entre si, e o resultado de cada uma é reportado na interface gráfica.

### Segurança

- Credenciais armazenadas exclusivamente em `config/.env` (não versionado)
- Uso de placeholders `%s` no MySQL para prevenção de SQL Injection
- Row Level Security (RLS) configurado no Supabase com policy de INSERT

---

## Configuração e Execução

### Pré-requisitos

- Python 3.13+
- XAMPP com serviço MySQL ativo
- Conta e projeto criado no Supabase
- Tabela `analise_bateria` criada em ambos os bancos
- RLS desabilitado ou policy de INSERT configurada no Supabase

### Instalação

```bash
pip install -r requirements.txt
```

### Variáveis de Ambiente

Preencha o arquivo `config/.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=bateria

SUPABASE_URL=https://xyzxyz.supabase.co
SUPABASE_KEY=eyJhbGci...
```

> Os valores do Supabase estão em: **Dashboard → Project Settings → API**

### Execução

```bash
python main.py
```

---

## Histórico de Commits

O projeto adota o padrão **Conventional Commits** (`tipo(escopo): descrição`).

| Commit | Arquivos |
|---|---|
| `feat: estrutura inicial do projeto em camadas` | Estrutura de pastas, `main.py`, `requirements.txt` |
| `feat(core): coleta de dados da bateria com psutil` | `core/battery.py` |
| `feat(core): modelo RegistroBateria` | `core/models.py` |
| `feat(db): conexão e repositório MySQL` | `db/connection.py`, `db/repository.py` (v1) |
| `feat(ui): interface Tkinter com exibição dos dados` | `ui/app.py` (v1), `main.py` |
| `refactor(db): separa conexão MySQL em connection_mysql.py` | `db/connection_mysql.py`, `db/connection.py` (removido) |
| `feat(db): conexão com Supabase via variáveis de ambiente` | `db/connection_supabase.py` |
| `feat(db): implementação do padrão Dual-Write MySQL + Supabase` | `db/repository.py`, `requirements.txt` |
| `fix(db): corrige pymysql.connect e remoção de tuplas em get_connection` | `db/connection_mysql.py` |
| `fix(db): serialização de datetime para isoformat no insert Supabase` | `db/repository.py` |
| `fix(ui): corrige referência self.status_sync e formatação de carga` | `ui/app.py` |
| `feat(ui): status de sincronização Dual-Write e atualização automática` | `ui/app.py` |

---

## Conclusão

Este projeto representa um exercício prático completo de desenvolvimento em Python, indo além de scripts isolados e aproximando-se de um sistema real com arquitetura definida, integração com múltiplos bancos de dados e interface gráfica.

A implementação do padrão **Dual-Write** introduz conceitos de resiliência e redundância de dados, enquanto o uso de variáveis de ambiente e `.gitignore` estabelece práticas fundamentais de segurança. O projeto serve como base sólida para sistemas futuros mais complexos e como material de estudo para boas práticas em arquitetura, persistência e segurança em Python.
