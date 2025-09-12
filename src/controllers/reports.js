
import { sequelize, Product } from '../db/index.js';
import { fn, col } from 'sequelize';

export const estoque = async (_req, res, next) => {
  try {
    const rows = await Product.findAll({
      attributes: ['tipo', [fn('SUM', col('quantidade')), 'total']],
      group: ['tipo']
    });

    // normaliza saída: { HQs, Livros, Total }
    let HQs = 0, Livros = 0;
    for (const r of rows) {
      const tipo = r.get('tipo');
      const total = Number(r.get('total') || 0);
      if (tipo === 'HQ') HQs = total;
      if (tipo === 'LIVRO') Livros = total;
    }
    res.json({ HQs, Livros, Total: HQs + Livros });
  } catch (e) { next(e); }
};
