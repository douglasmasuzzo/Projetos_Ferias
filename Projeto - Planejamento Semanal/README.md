# Planejador Semanal

Aplicação web pequena em React (Vite) para organizar a semana entre trabalho/estágio, estudos e projetos pessoais.

## Funcionalidades

- Grade semanal (Manhã/Tarde/Noite x dias da semana) com blocos clicáveis que alternam entre categorias: Trabalho, Estudos, Projeto pessoal e Livre.
- Lista de prioridades da semana com checkbox, edição inline e remoção.
- Persistência automática no `localStorage` do navegador — os dados continuam salvos ao recarregar a página.

## Stack

- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/) como bundler e servidor de desenvolvimento
- CSS puro (sem dependências extras de estilo)

## Como rodar localmente

```bash
npm install
npm run dev
```

O projeto sobe em `http://localhost:5173` por padrão.

## Build de produção

```bash
npm run build
npm run preview
```

## Estrutura

```
src/
  components/
    ScheduleGrid.jsx      # Grade semanal interativa
    PriorityList.jsx      # Lista de prioridades da semana
    WeeklyPlanner.jsx      # Componente raiz que une grade + prioridades
  hooks/
    useLocalStorage.js    # Hook de persistência no localStorage
  constants.js             # Dias, horários, categorias e chaves de storage
  App.jsx / App.css
  main.jsx / index.css
```

## Possíveis evoluções

- Migrar a persistência para um backend (ex: Supabase) para acessar o planejamento em múltiplos dispositivos.
- Adicionar suporte a múltiplas semanas/histórico.
- Exportar a semana como imagem ou PDF.
