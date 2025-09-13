import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

app.use(express.static('public'));

import productsRouter from './routes/products.js';
import movementsRouter from './routes/movements.js';
import reportsRouter from './routes/reports.js';
import authRouter from './routes/auth.js';

import { sequelize } from './db/index.js';
import { errorHandler, notFound } from './middlewares/error.js';

const app = express();

// segurança & logs
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());


// healthchecks
app.get('/health', (_req, res) => res.json({ ok: true, db: 'unknown' }));
app.get('/ready', async (_req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'db down' });
  }
});

// home
app.get('/', (_req, res) => {
  res.send(`
    <h1>Stock Overflow API</h1>
    <ul>
      <li><a href="/health">/health</a></li>
      <li><a href="/ready">/ready</a></li>
      <li><a href="/produtos">/produtos</a></li>
      <li><a href="/movimentacoes">/movimentacoes</a></li>
      <li><a href="/relatorios/estoque">/relatorios/estoque</a></li>
    </ul>
  `);
});

// rotas
app.use('/auth', authRouter);
app.use('/produtos', productsRouter);
app.use('/movimentacoes', movementsRouter);
app.use('/relatorios', reportsRouter);

// 404 + handler
app.use(notFound);
app.use(errorHandler);

export default app;
