import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';

const Expense = sequelize.define('Expense', {
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Expense.belongsTo(User, { foreignKey: 'userId' });

export default Expense;
