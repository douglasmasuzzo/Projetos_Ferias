# Planejador Semanal

Aplicação web em React (Vite) para organizar a semana entre trabalho/estágio, estudos e projetos pessoais. Agora com tipos de atividade personalizáveis, prioridades com destaque visual, e sincronização remota via Supabase.

## Funcionalidades

- **Grade semanal** (Manhã/Tarde/Noite x dias da semana) com blocos clicáveis
- **Tipos de atividade personalizados**: crie seus próprios blocos (nome + cor) em vez de categorias fixas — ex: "Academia", "Leitura", "Freela"
- **Lista de prioridades** com 3 níveis (Baixa/Média/Alta), ordenação automática por peso de prioridade, e **destaque visual** (badge + leve pulsação) nas tarefas de prioridade Alta
- **Sincronização com Supabase**: os dados ficam salvos na nuvem, acessíveis de qualquer dispositivo. O localStorage funciona como cache local e fallback automático caso a conexão falhe

## Stack

- React 18 + Vite
- Supabase (Postgres + API REST via @supabase/supabase-js)
- CSS puro

## Configuração do Supabase

1. Crie um projeto em supabase.com (ou use um já existente)
2. No SQL Editor do painel, execute o conteúdo de `supabase-schema.sql` deste repositório — ele cria as tabelas `activity_types`, `schedule_slots` e `priorities`, com alguns tipos de atividade padrão
3. Em Project Settings > API, copie a URL e a anon public key
4. Copie `.env.example` para `.env` e preencha:

```
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

> Sem o `.env` configurado, o app continua funcionando normalmente, apenas usando só o localStorage (modo offline).

> Nota de segurança: as tabelas usam políticas de acesso público (sem autenticação de usuário), pensadas para uso pessoal de portfólio. Não é recomendado para dados sensíveis ou uso multiusuário sem adicionar autenticação.

## Como rodar localmente

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
npm run preview
```

Ao fazer deploy (ex: Vercel), lembre-se de configurar as mesmas variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY nas Environment Variables do projeto.

## Estrutura

```
src/
  components/
    ScheduleGrid.jsx          # Grade semanal interativa
    ActivityTypeManager.jsx   # Criação/remoção de tipos de atividade
    PriorityList.jsx          # Lista de prioridades com níveis
    WeeklyPlanner.jsx         # Componente raiz: integra Supabase + cache local
  hooks/
    useLocalStorage.js        # Cache/fallback local
  api.js                       # Funções de acesso ao Supabase (CRUD)
  supabaseClient.js            # Cliente Supabase configurado via .env
  constants.js                  # Dias, horários, níveis de prioridade
supabase-schema.sql             # Script para criar as tabelas no Supabase
.env.example                    # Modelo de variáveis de ambiente
```

## Possíveis evoluções

- Autenticação de usuário (Supabase Auth) para uso multiusuário real
- Notificações push do navegador para tarefas de prioridade Alta
- Histórico de semanas anteriores
