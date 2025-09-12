
import { Product } from '../db/index.js';
import { Op } from 'sequelize';
 
  
  export const list = async (req, res, next) => {
  try {
    const { q, tipo, page = 1, limit = 20 } = req.query;

    const where = {};
    if (q)   where.titulo = { [Op.like]: `%${q}%` };
    if (tipo && ['HQ','LIVRO'].includes(tipo)) where.tipo = tipo;

    const take = Math.min(Number(limit) || 20, 100);
    const skip = (Number(page) - 1) * take;

    const { rows, count } = await Product.findAndCountAll({
      where, order: [['id', 'DESC']], limit: take, offset: skip
    });

    res.json({ items: rows, page: Number(page), limit: take, total: count, pages: Math.ceil(count / take) });
  } catch (e) { next(e); }
};

export const create = async (req, res, next) => {
  try {
    const body = req.body || {};
    const p = await Product.create(body);
    res.status(201).json(p);
  } catch (e) { next(e); }
};

export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const p = await Product.findByPk(id);
    if (!p) return res.status(404).json({ error: 'Produto não encontrado' });
    await p.update(req.body || {});
    res.json(p);
  } catch (e) { next(e); }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const p = await Product.findByPk(id);
    if (!p) return res.status(404).json({ error: 'Produto não encontrado' });
    await p.destroy();
    res.status(204).send();
  } catch (e) { next(e); }
};

export const getOne = async (req, res, next) => {
  try {
    const p = await Product.findByPk(req.params.id);
    if (!p) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(p);
  } catch (e) { next(e); }
};
