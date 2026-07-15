# Dudamakes Precificacao

App React + Vercel Serverless com login, senha e banco Postgres gratuito para salvar produtos e progresso de precificacao.

## O que ja esta pronto

- Primeiro acesso cria o usuario admin.
- Depois do usuario criado, a tela passa a ser login e senha.
- Produtos ficam salvos no banco, nao apenas no navegador.
- Ao voltar e logar novamente, o sistema abre direto no painel se ja houver produtos cadastrados.
- Progresso, custos, precos e status ficam persistidos.
- Exportacao em CSV continua disponivel no painel.

## Rodar localmente

1. Instale as dependencias:

```bash
npm install
```

2. Crie um arquivo `.env.local` com:

```bash
DATABASE_URL="sua_url_postgres_neon"
SESSION_SECRET="uma_senha_grande_aleatoria"
```

3. Rode o app:

```bash
npm run dev
```

Observacao: as rotas `api/` sao feitas para Vercel. Para testar 100% igual a producao localmente, use a Vercel CLI:

```bash
npm i -g vercel
vercel dev
```

## Hospedar 100% gratuito

1. Crie uma conta gratis na Vercel: https://vercel.com
2. Crie uma conta gratis na Neon: https://neon.tech
3. Na Neon, crie um projeto Postgres gratuito e copie a connection string.
4. Na Vercel, importe este projeto pelo GitHub ou envie pelo Vercel CLI.
5. Em `Project Settings > Environment Variables`, adicione:

```bash
DATABASE_URL=connection string da Neon
SESSION_SECRET=qualquer texto grande e dificil de adivinhar
```

6. Deploy:

```bash
vercel --prod
```

No primeiro acesso ao site publicado, crie o usuario e senha. Depois disso, esse cadastro inicial fica bloqueado e o sistema passa a exigir login.

## Comandos uteis

```bash
npm run lint
npm run build
```
