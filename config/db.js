import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false,
});

// Test the connection
sequelize.authenticate()
  .then(() => console.log('MySQL Database connected.'))
  .catch(err => console.log('Error: ' + err));

export default sequelize;
