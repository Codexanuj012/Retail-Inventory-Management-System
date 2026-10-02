const fs = require('fs');
const path = require('path');

const logsDir = path.resolve(__dirname, '../logs');

// Ensure logs directory exists
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const errorLogPath = path.join(logsDir, 'error.log');
const combinedLogPath = path.join(logsDir, 'combined.log');

const writeToFile = (filePath, message) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  fs.appendFile(filePath, logEntry, (err) => {
    if (err) console.error('Failed to write to log file:', err);
  });
};

const logger = {
  info: (message) => {
    const formatted = `[INFO]: ${message}`;
    console.log(formatted);
    writeToFile(combinedLogPath, formatted);
  },
  warn: (message) => {
    const formatted = `[WARN]: ${message}`;
    console.warn(formatted);
    writeToFile(combinedLogPath, formatted);
  },
  error: (message, err = '') => {
    const errorDetails = err && err.stack ? err.stack : err;
    const formatted = `[ERROR]: ${message} ${errorDetails}`;
    console.error(formatted);
    writeToFile(combinedLogPath, formatted);
    writeToFile(errorLogPath, formatted);
  }
};

module.exports = logger;