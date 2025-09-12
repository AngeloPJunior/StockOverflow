
import 'dotenv/config';
import { sequelize, User } from './index.js';
import bcrypt from 'bcryptjs';

(async () => {
  try {
    await sequelize.authenticate();

    const senha = await bcrypt.hash('123', 10); // senha inicial
    const [user, created] = await User.findOrCreate({
      where: { email: 'angelo@stock.local' },
      defaults: {
        nome: 'Angelo',
        email: 'angelo@stock.local',
        senha_hash: senha,
      },
    });

    if (created) {
      console.log('✅ Usuário admin criado (angelo@stock.local / 123)');
    } else {
      console.log('ℹ️ Usuário admin já existia');
    }

    process.exit(0);
  } catch (e) {
    console.error('❌ Erro ao criar usuário admin:', e);
    process.exit(1);
  }
})();
