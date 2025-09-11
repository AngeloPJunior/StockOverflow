import { Product, Movement } from '../db/index.js';

export const list = async (req, res, next) => {
  try {
    const { produtoId } = req.query;
    const where = {};
    if (produtoId) where.produtoId = produtoId;
    const movs = await Movement.findAll({ where, order: [['id', 'DESC']] });
    res.json(movs);
  } catch (e) { next(e); }
};

export const create = async (req, res, next) => {
  try {
    const { produtoId, tipo, quantidade, observacao } = req.body;
    if (!produtoId || !tipo || !quantidade) {
      return res.status(400).json({ error: 'produtoId, tipo e quantidade são obrigatórios' });
    }
    const prod = await Product.findByPk(produtoId);
    if (!prod) return res.status(404).json({ error: 'Produto não encontrado' });

    if (tipo === 'SAIDA') {
      if (prod.quantidade < quantidade) {
        return res.status(400).json({ error: 'Saldo insuficiente para saída' });
      }
      prod.quantidade -= quantidade;
    } else if (tipo === 'ENTRADA') {
      prod.quantidade += quantidade;
    } else {
      return res.status(400).json({ error: "tipo deve ser 'ENTRADA' ou 'SAIDA'" });
    }

    await prod.save();
    const mov = await Movement.create({ produtoId, tipo, quantidade, observacao });
    res.status(201).json({ movimento: mov, saldoAtual: prod.quantidade });
  } catch (e) { next(e); }
};
