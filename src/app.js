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

app.use('/produtos', productsRouter);
app.use('/movimentacoes', movementsRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
