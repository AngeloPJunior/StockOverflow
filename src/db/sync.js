
import 'dotenv/config';
import sequelize from './index.js';

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true }); // use { force: true } só se quiser recriar do zero
    console.log('✅ Tabelas sincronizadas com sucesso');
    process.exit(0);
  } catch (e) {
    console.error('❌ Erro ao sincronizar tabelas:', e);
    process.exit(1);
  }
})();
