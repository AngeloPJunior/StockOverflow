import 'dotenv/config';
import app from './app.js';
import { sequelize } from './db/index.js';

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// rota de health simples (API viva)
app.get('/health', (_req, res) => {
  res.json({ ok: true, db: 'unknown' });
});

// rota de ready (checa DB também)
app.get('/ready', async (_req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado ao banco com sucesso');
    app.listen(PORT, HOST, () => {
      console.log(`🚀 API rodando em http://${HOST}:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Erro ao conectar no banco:', err);
    process.exit(1);
  }
}

start();
