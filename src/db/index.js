import { Sequelize } from 'sequelize';
import ProductModel from '../models/Product.js';
import MovementModel from '../models/Movement.js';
import UserModel from '../models/User.js';

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
  }
);

// Models
export const Product = ProductModel(sequelize);
export const Movement = MovementModel(sequelize);
export const User = UserModel(sequelize);

// Relacionamentos
Movement.belongsTo(Product, { foreignKey: 'produtoId' });
Product.hasMany(Movement, { foreignKey: 'produtoId' });

export default sequelize;
