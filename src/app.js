// src/app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Rotas (ajuste os caminhos se seu projeto usar nomes diferentes)
import productsRouter from './routes/products.js';
import movementsRouter from './routes/movements.js';
import reportsRouter from './routes/reports.js';
import authRouter from './routes/auth.js';

const app = express();

// middlewares base
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// servir arquivos estáticos do frontend
app.use(express.static('public'));

// rotas da API
app.use('/auth', authRouter);
app.use('/produtos', productsRouter);
app.use('/movimentacoes', movementsRouter);
app.use('/relatorios', reportsRouter);

// rota raiz -> index.html
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.get('/', (_req, res) => {
  res.sendFile(join(__dirname, '../public/index.html'));
});

export default app;
