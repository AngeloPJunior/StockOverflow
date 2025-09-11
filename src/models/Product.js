import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Product = sequelize.define('Product', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    codigo: { type: DataTypes.STRING(64), allowNull: true, unique: true },
    titulo: { type: DataTypes.STRING(200), allowNull: false },
    autor: { type: DataTypes.STRING(120), allowNull: true },
    editora: { type: DataTypes.STRING(120), allowNull: true },
    genero: { type: DataTypes.STRING(80), allowNull: true },
    tipo: { type: DataTypes.ENUM('HQ', 'LIVRO'), allowNull: false, defaultValue: 'HQ' },
    idioma: { type: DataTypes.STRING(40), allowNull: true },
    ano: { type: DataTypes.INTEGER, allowNull: true },
    edicao: { type: DataTypes.STRING(40), allowNull: true },
    quantidade: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  }, {
    tableName: 'produtos',
    underscored: true
  });

  return Product;
};
