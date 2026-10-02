const mysql = require('mysql2/promise');
const env = require('./env');
const logger = require('./logger');

const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00'
});

// Test connection functionality
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    logger.info(`Successfully connected to MySQL database: ${env.DB_NAME}`);
    connection.release();
  } catch (error) {
    logger.error('Failed to connect to MySQL database:', error);
    throw error;
  }
};

module.exports = {
  pool,
  testConnection
};