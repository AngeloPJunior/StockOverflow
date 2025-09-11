import 'dotenv/config';
import app from './app.js';
import { sequelize } from './db/index.js';

const port = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado ao banco com sucesso');
    app.listen(port, () => {
      console.log(`🚀 API rodando em http://localhost:${port}`);
    });
  } catch (err) {
    console.error('❌ Erro ao conectar no banco:', err);
    process.exit(1);
  }
}

start();
