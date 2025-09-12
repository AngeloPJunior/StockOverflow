
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../db/index.js';

const router = Router();

router.post('/login', async (req, res, next) => {
  try {
    const { email, senha } = req.body || {};
    if (!email || !senha) return res.status(400).json({ error: 'email e senha são obrigatórios' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

    const ok = await bcrypt.compare(senha, user.senha_hash);
    if (!ok) return res.status(401).json({ error: 'Credenciais inválidas' });

    const token = jwt.sign(
      { sub: user.id, email: user.email, nome: user.nome },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '2h' }
    );

    res.json({ token, user: { id: user.id, nome: user.nome, email: user.email } });
  } catch (e) { next(e); }
});

export default router;
