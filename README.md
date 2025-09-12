npm insta# Stock Overflow - API (MVP)

API simples (Express + Sequelize + MySQL) para gerenciar estoque de HQs e Livros.# Stock Overflow — HQs & Livros

API + front simples para controle de estoque (Node.js, Express, Sequelize, MySQL).

## Como rodar localmente
1. Crie `.env` na raiz (baseado em `.env.example`).
2. Instale deps:
   ```bash
   npm install

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

## Deploy em 3 VMs
Arquitetura

VM1 — Proxy (NGINX)
IP: 192.168.47.128
Responsável por expor a aplicação na porta 80 e encaminhar para a VM2.
Apenas esta VM é acessível externamente.

VM2 — Aplicação (Node.js + Express + Sequelize)
IP: 192.168.47.129
Roda a API + frontend estático na porta 3000.
Só acessível pela VM1 (rede interna).

VM3 — Banco de Dados (MySQL)
IP: 192.168.47.130
Roda MySQL 8, porta 3306.
Só aceita conexões da VM2.

Fluxo:
Usuário → VM1:80 (NGINX) → VM2:3000 (Node) → VM3:3306 (MySQL)

##Passos de Deploy
##VM3 (MySQL)
```bash
sudo apt update && sudo apt -y install mysql-server
sudo sed -i 's/^bind-address.*/bind-address = 0.0.0.0/' /etc/mysql/mysql.conf.d/mysqld.cnf
sudo systemctl restart mysql

sudo mysql <<SQL
CREATE DATABASE IF NOT EXISTS stock_overflow
  CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

DROP USER IF EXISTS 'stock'@'192.168.47.129';
CREATE USER 'stock'@'192.168.47.129' IDENTIFIED BY 'TroqueEstaSenha!';
GRANT ALL PRIVILEGES ON stock_overflow.* TO 'stock'@'192.168.47.129';
FLUSH PRIVILEGES;
SQL
```

##VM2 (App)
```bash
sudo apt update
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt -y install nodejs git make g++ python3 mysql-client

sudo mkdir -p /opt/stockoverflow
cd /opt/stockoverflow
git clone https://github.com/SEU_USUARIO/StockOverflow.git .
cp ops/env/.env.prod.example .env

# configure .env:
# DB_HOST=192.168.47.130
# DB_USER=stock
# DB_PASS=TroqueEstaSenha!
# DB_NAME=stock_overflow
# JWT_SECRET=troque-por-uma-senha-bem-forte

npm install
npm run db:sync
npm run db:seed
npm run db:seed:user
```
Criar serviço systemd:
```bash
sudo tee /etc/systemd/system/stockoverflow.service >/dev/null <<UNIT
[Unit]
Description=Stock Overflow API (Node)
After=network.target

[Service]
Environment=NODE_ENV=production
EnvironmentFile=/opt/stockoverflow/.env
WorkingDirectory=/opt/stockoverflow
ExecStart=/usr/bin/node src/server.js
Restart=always
User=angelo
Group=angelo

[Install]
WantedBy=multi-user.target
UNIT

sudo systemctl daemon-reload
sudo systemctl enable --now stockoverflow
systemctl status stockoverflow --no-pager
```

##VM1 (NGINX Proxy)
```bash
sudo apt update && sudo apt -y install nginx

sudo tee /etc/nginx/sites-available/stockoverflow >/dev/null <<NGINX
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://192.168.47.129:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINX

sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -s /etc/nginx/sites-available/stockoverflow /etc/nginx/sites-enabled/stockoverflow
sudo nginx -t && sudo systemctl reload nginx
```
Teste:
```bash
curl -i http://localhost/health
```

##Testes finais

Acesse no navegador do host:
 http://192.168.47.128/

Login padrão:

email: angelo@stock.local

senha: 123

Testar:

cadastrar produtos,

registrar movimentações,

ver resumo do estoque,

checar /health.

##Segurança

Banco não acessível de fora, só VM2 → VM3.

Aplicação não acessível de fora, só VM1 → VM2.

Apenas VM1 exposta ao usuário (porta 80).

.env com credenciais fora do GitHub.

Usuário MySQL restrito a 1 IP (192.168.47.129).

JWT_SECRET definido para autenticação segura.
