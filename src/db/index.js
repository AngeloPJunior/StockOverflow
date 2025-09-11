import { Sequelize } from 'sequelize';
import 'dotenv/config';

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false
  }
);

// Import dos models
import ProductModel from '../models/Product.js';
import MovementModel from '../models/Movement.js';

export const Product = ProductModel(sequelize);
export const Movement = MovementModel(sequelize);

// Associações
Product.hasMany(Movement, { foreignKey: 'produtoId', as: 'movimentos' });
Movement.belongsTo(Product, { foreignKey: 'produtoId', as: 'produto' });
