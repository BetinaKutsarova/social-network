import { Sequelize } from 'sequelize';
import { config } from '../../config';

// Create and export Sequelize instance
const sequelize = new Sequelize({
  host: config.database.host,
  port: config.database.port,
  username: config.database.user,
  password: config.database.password,
  database: config.database.name,
  dialect: 'postgres',
  pool: {
    max: 20,
    idle: 30000
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false
});

// Initialize database
export const initDatabase = async () => {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('Database connection established successfully');
    
    // Import model associations
    // await require('./associations').default();
    
    // Sync models with database
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Database models synchronized successfully');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

export default sequelize;