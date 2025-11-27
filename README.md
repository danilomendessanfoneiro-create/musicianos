# MusicianOS — Cleaned Export

Este repositório é uma versão **limpa** exportada do Google AI Studio e ajustada para trabalhar com Vite + React + TypeScript.

## O que eu adicionei
- Estrutura mínima `src/` com `main.tsx`, `App.tsx`
- Roteamento com React Router (páginas: Login, Dashboard)
- `PrivateRoute` simples usando Firebase Auth
- `src/firebase.ts` com template para variáveis de ambiente
- `.env.example` com as chaves Vite/Firebase
- `vercel.json` configurado para deploy estático
- `package.json` (atualizado/gerado) com scripts `dev`, `build`, `preview`
- `tsconfig.json` mínimo (se não existia)

## Como usar
1. Copie `.env.example` para `.env.local` e preencha com suas credenciais do Firebase.
2. `npm install` ou `pnpm install` ou `yarn`
3. `npm run dev` para desenvolvimento
4. `npm run build` para gerar `/dist`
5. Fazer deploy no Vercel apontando para o repositório.

## Observações
- Eu não executei `npm install` ou `npm run dev` aqui — preparei tudo para você rodar localmente.
- Se o projeto original tinha arquivos customizados, eles foram preservados dentro da pasta extraída — esta versão adiciona a estrutura mínima em `src/` no nível do projeto.
