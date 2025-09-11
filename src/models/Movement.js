import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Movement = sequelize.define('Movement', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    produtoId: { type: DataTypes.INTEGER, allowNull: false, field: 'produto_id' },
    tipo: { type: DataTypes.ENUM('ENTRADA', 'SAIDA'), allowNull: false },
    quantidade: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
    observacao: { type: DataTypes.STRING(255), allowNull: true },
  }, {
    tableName: 'movimentacoes',
    underscored: true
  });

  return Movement;
};
