export function notFound(req, res, next) {
  res.status(404).json({ error: 'Rota não encontrada' });
}

export function errorHandler(err, req, res, next) { // eslint-disable-line
  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor' });
}
