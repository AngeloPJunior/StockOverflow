# Stock Overflow - API (MVP)

API simples (Express + Sequelize + MySQL) para gerenciar estoque de HQs e Livros.

## 1) Requisitos
- Node.js 18+
- MySQL 8+

## 2) Instalação
```bash
npm install
cp .env.example .env
# edite o .env com suas credenciais do MySQL
```

Crie o banco de dados no MySQL:
```sql
CREATE DATABASE stock_overflow CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
```

Sincronize as tabelas (modo dev):
```bash
npm run db:sync
```

Suba o servidor:
```bash
npm run dev
# ou
npm start
```

## 3) Endpoints
- `GET /health` → status
- `GET /produtos` → lista de produtos
- `POST /produtos` → cria produto
- `PUT /produtos/:id` → atualiza produto
- `DELETE /produtos/:id` → remove produto
- `GET /movimentacoes?produtoId=ID` → lista movimentações (opcional filtrar por produto)
- `POST /movimentacoes` → cria movimentação (ENTRADA/SAIDA) e atualiza estoque

### Exemplo `POST /produtos`
```json
{
  "codigo": "ISBN-978-857351",
  "titulo": "Sandman - Prelúdios & Noturnos",
  "autor": "Neil Gaiman",
  "editora": "Panini",
  "genero": "Fantasia",
  "tipo": "HQ",
  "idioma": "PT-BR",
  "ano": 2019,
  "edicao": "1",
  "quantidade": 10
}
```

### Exemplo `POST /movimentacoes`
```json
{
  "produtoId": 1,
  "tipo": "SAIDA",
  "quantidade": 2,
  "observacao": "Venda balcão"
}
```

## 4) Próximos passos (opcional)
- Autenticação (JWT)
- Paginação/filtros em `/produtos`
- Relatórios
- Dockerfile e docker-compose
- Testes automatizados
```

