const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const env = require('./config/env');
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorMiddleware');
const { successResponse } = require('./utils/response');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true
}));

// Request Logging
if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Body Parsing Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Base Health Check Route
app.get('/', (req, res) => {
  return successResponse(res, 200, 'RIMS Backend API is running');
});

// Base API Status Route
app.get('/api/health', (req, res) => {
  return successResponse(res, 200, 'RIMS API Service is healthy', {
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);

// 404 Route Handler
app.use(notFoundHandler);

// Centralized Error Handler
app.use(globalErrorHandler);

module.exports = app;