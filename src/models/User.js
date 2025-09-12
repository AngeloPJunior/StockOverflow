// src/models/User.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const User = sequelize.define('User', {
    id: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },
    nome: { 
      type: DataTypes.STRING(120), 
      allowNull: false 
    },
    email: { 
      type: DataTypes.STRING(120), 
      allowNull: false, 
      unique: true, 
      validate: { isEmail: true }
    },
    senha_hash: { 
      type: DataTypes.STRING(255), 
      allowNull: false 
    },
  }, { 
    tableName: 'usuarios',
    underscored: true,   // nomes de colunas no padrão snake_case
    timestamps: true     // created_at / updated_at
  });

  return User;
};
