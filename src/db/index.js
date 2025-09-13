import { Sequelize } from 'sequelize';
import ProductModel from '../models/Product.js';
import MovementModel from '../models/Movement.js';
import UserModel from '../models/User.js';

const {
  DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS
} = process.env;

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: Number(DB_PORT) || 3306,
  dialect: "mysql",
  logging: false
});

// Models
export const Product = ProductModel(sequelize);
export const Movement = MovementModel(sequelize);
export const User = UserModel(sequelize);

// Relacionamentos
Movement.belongsTo(Product, { foreignKey: 'produtoId' });
Product.hasMany(Movement, { foreignKey: 'produtoId' });

export default sequelize;
