import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import productsRouter from './routes/products.js';
import movementsRouter from './routes/movements.js';
import { errorHandler, notFound } from './middlewares/error.js';


const app = express(); 
app.use(express.static('public'));

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.get('/', (_req, res) => {
  res.send(`
    <h1>Stock Overflow API</h1>
    <p>Bem-vindo! Endpoints disponíveis:</p>
    <ul>
      <li><a href="/health">/health</a></li>
      <li><a href="/produtos">/produtos</a></li>
      <li><a href="/movimentacoes">/movimentacoes</a></li>
    </ul>
  `);
});


app.use('/produtos', productsRouter);
app.use('/movimentacoes', movementsRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
