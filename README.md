# AllBuy — Frontend

Interface web do projeto **AllBuy**, plataforma de e-commerce. Construída com React 19, TypeScript e TailwindCSS 4, seguindo os padrões de design system com shadcn/ui.

---

## Tech Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| Estilo | TailwindCSS 4 + tw-animate-css |
| Componentes | shadcn/ui (Radix UI + CVA) |
| Roteamento | React Router 7 |
| Testes | Vitest 4 + Testing Library |
| Linting | ESLint 9 + typescript-eslint |
| Runtime | Node.js 22 LTS |
| Produção | nginx (via Docker) |

---

## Pré-requisitos

- [Node.js 22 LTS](https://nodejs.org/)
- [Docker](https://www.docker.com/) (opcional, para rodar em container)
- Backend [`Loja_Online`](../Loja_Online) rodando localmente

---

## Primeiros passos

### 1. Clone o repositório

```bash
git clone https://github.com/ProjetoLojaOnline/Loja_Online_Front.git
cd Loja_Online_Front
```

### 2. Configure as variáveis de ambiente

```bash
cp envs/.env.example envs/.env.local
```

Edite `envs/.env.local` com os valores do seu ambiente:

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `VITE_API_BASE_URL` | URL base do backend | `http://localhost:8080` |

> Os arquivos `envs/.env*` (exceto `.env.example`) são ignorados pelo git.

### 3. Instale as dependências

```bash
npm install
```

### 4. Configure os git hooks

```bash
npm run setup-hooks
```

### 5. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

---

## Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm run preview` | Serve o build localmente |
| `npm run lint` | Verifica lint no código |
| `npm run lint:fix` | Corrige problemas de lint automaticamente |
| `npm run test` | Roda os testes em modo watch |
| `npm run test:run` | Roda os testes uma vez (CI) |
| `npm run coverage` | Gera relatório de cobertura |
| `npm run setup-hooks` | Instala os git hooks do projeto |

---

## Estrutura do projeto

```
src/
├── components/
│   ├── common/          # Componentes de marca (Logo, Spinner)
│   └── ui/              # Design system: Button, Input, Label, Checkbox
├── context/
│   └── AuthContext.tsx  # Estado global de autenticação (JWT)
├── hooks/
│   └── useLoginForm.ts  # Lógica do formulário de login
├── lib/
│   └── utils.ts         # Utilitário cn() para classes CSS
├── routes/
│   └── Login.tsx        # Página de login
├── styles/
│   └── globals.css      # Tokens de design e configuração do Tailwind
└── test/
    ├── functional/      # Testes funcionais de páginas
    ├── unit/            # Testes unitários de componentes, hooks e contexto
    └── setup.ts         # Configuração global dos testes
```

---

## Docker

### Build e execução manual

```bash
docker build \
  --build-arg VITE_API_BASE_URL=http://seu-backend:8080 \
  -t allbuy-front .

docker run -p 80:80 allbuy-front
```

### Com Docker Compose

```bash
docker compose up --build
```

A aplicação ficará disponível em `http://localhost`.

> A variável `VITE_API_BASE_URL` é injetada em **tempo de build** pelo Vite. Altere o valor no `docker-compose.yaml` ou passe via `--build-arg`.

---

## Testes

```bash
# Todos os testes
npm run test:run

# Modo watch (desenvolvimento)
npm run test

# Cobertura
npm run coverage
```

Os testes estão organizados em:

- **Unit** — componentes UI, hooks e contexto de forma isolada
- **Functional** — fluxos completos simulando interação do usuário na página

---

## CI/CD

O pipeline de CI (`.github/workflows/ci.yml`) executa automaticamente em cada push:

1. Type check TypeScript
2. Testes (`vitest run`)
3. Build de produção

---

## Git Hooks

O projeto usa hooks locais (`.githooks/`) instalados via `npm run setup-hooks`:

| Hook | Ações |
|------|-------|
| `pre-push` | Lint → Testes → Build |

---

## Backend

Este frontend se comunica com a API [`Loja_Online`](../Loja_Online) (Spring Boot).

Endpoint utilizado:

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/login/authenticate` | Autenticação — retorna JWT |
