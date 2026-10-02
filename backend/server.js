const app = require('./app');
const env = require('./config/env');
const logger = require('./config/logger');
const { testConnection } = require('./config/db');

const PORT = env.PORT;

let server;

const startServer = async () => {
  try {
    // Verify Database Connection (Warn on failure without halting initial app start if DB is offline during setup)
    try {
      await testConnection();
    } catch (dbError) {
      logger.warn('Server starting with database connection warning. Ensure MySQL is running.');
    }

    server = app.listen(PORT, () => {
      logger.info(`RIMS Server running on port ${PORT} in ${env.NODE_ENV} mode`);
    });
  } catch (error) {
    logger.error('Fatal error during server startup:', error);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...', err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...', err);
  process.exit(1);
});