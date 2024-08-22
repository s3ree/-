import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Expense from './Expense.js';

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.hasMany(Expense, { foreignKey: 'userId', onDelete: 'CASCADE' });

export default User;
