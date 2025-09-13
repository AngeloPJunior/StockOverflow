# Stock Overflow — HQs & Livros

API + frontend simples para controle de estoque (Node.js, Express, Sequelize, MySQL).

## Arquitetura de Deploy (3 VMs)

- **VM1 — Proxy (NGINX)**  
  IP: 192.168.47.128  
  Expõe a aplicação na porta 80 e encaminha para a VM2.  

- **VM2 — Aplicação (Node.js + Express)**  
  IP: 192.168.47.129  
  Roda a API + frontend estático na porta 3000.  

- **VM3 — Banco de Dados (MySQL)**  
  IP: 192.168.47.130  
  Roda MySQL 8, porta 3306.  

Fluxo:  
Usuário → VM1:80 (NGINX) → VM2:3000 (Node.js) → VM3:3306 (MySQL)

---

## Passos de Deploy

### VM3 — Banco (MySQL)
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

---

### VM2 — Aplicação (Node.js)
```bash
sudo apt update
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt -y install nodejs git make g++ python3 mysql-client

sudo mkdir -p /opt/stockoverflow
cd /opt/stockoverflow
git clone https://github.com/AngeloPJunior/StockOverflow.git .
npm install

cat > .env <<'EOF'
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
DB_HOST=192.168.47.130
DB_PORT=3306
DB_NAME=stock_overflow
DB_USER=stock
DB_PASS=TroqueEstaSenha!
JWT_SECRET=troque-esta-chave
EOF

# iniciar em segundo plano
pkill -9 node || true
nohup npm start > /tmp/api.log 2>&1 &
sleep 2
```

Testes locais:
```bash
curl -s http://127.0.0.1:3000/health
curl -s http://127.0.0.1:3000/produtos | head
```

(Se necessário, criar admin padrão para login:)
```bash
node src/db/seed_user.js 2>/dev/null || node - <<'NODE'
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { sequelize } from './src/db/index.js';
import User from './src/models/User.js';

await sequelize.authenticate(); await sequelize.sync();
const email='admin@stock.local', senha='admin123', hash=await bcrypt.hash(senha,10);
const [u,c]=await User.findOrCreate({where:{email},defaults:{nome:'Admin',email,senhaHash:hash,role:'ADMIN'}});
if(!c){u.senhaHash=hash;u.role='ADMIN';await u.save();}
console.log('✅ Admin criado:', email, senha);
process.exit(0);
NODE
```

---

### VM1 — Proxy (NGINX)
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
sudo ln -sf /etc/nginx/sites-available/stockoverflow /etc/nginx/sites-enabled/stockoverflow
sudo nginx -t
sudo systemctl restart nginx
```

Testes:
```bash
curl -s http://127.0.0.1/health
curl -s http://127.0.0.1/produtos | head
```

---

## Testes Finais (do PC)
```bash
# lista de produtos
curl -s http://192.168.47.128/produtos | head

# login admin
curl -s http://192.168.47.128/auth/login   -H 'Content-Type: application/json'   -d '{"email":"admin@stock.local","senha":"admin123"}'
```

No navegador:  
👉 http://192.168.47.128/

---

## Credenciais padrão
- email: `admin@stock.local`  
- senha: `admin123`

---

## Segurança
- Banco (VM3) só acessível da VM2.  
- App (VM2) só acessível pela VM1.  
- Apenas VM1 exposta ao usuário (porta 80).  
- `.env` com credenciais fora do GitHub.  
- Usuário MySQL restrito a 1 IP (VM2).  
- `JWT_SECRET` definido no `.env` para autenticação.
