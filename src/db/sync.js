import { sequelize } from './index.js';
import '../models/Product.js';
import '../models/Movement.js';

async function sync() {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Tabelas sincronizadas com sucesso');
    process.exit(0);
  } catch (e) {
    console.error('❌ Erro ao sincronizar tabelas:', e);
    process.exit(1);
  }
}

sync();
