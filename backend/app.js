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
const warehouseRoutes = require('./routes/warehouseRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const stockMovementRoutes = require('./routes/stockMovementRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reportRoutes = require('./routes/reportRoutes');
const auditLogRoutes = require('./routes/auditLogRoutes');

// Runtime validation to prevent router crash
const validateRouter = (name, routeModule) => {
  if (typeof routeModule !== 'function') {
    throw new TypeError(`Route module "${name}" did not export a valid Express router function.`);
  }
};

validateRouter('authRoutes', authRoutes);
validateRouter('userRoutes', userRoutes);
validateRouter('categoryRoutes', categoryRoutes);
validateRouter('productRoutes', productRoutes);
validateRouter('warehouseRoutes', warehouseRoutes);
validateRouter('inventoryRoutes', inventoryRoutes);
validateRouter('stockMovementRoutes', stockMovementRoutes);
validateRouter('supplierRoutes', supplierRoutes);
validateRouter('orderRoutes', orderRoutes);
validateRouter('reportRoutes', reportRoutes);
validateRouter('auditLogRoutes', auditLogRoutes);

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
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/stock-movements', stockMovementRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/audit-logs', auditLogRoutes);

// 404 Route Handler
app.use(notFoundHandler);

// Centralized Error Handler
app.use(globalErrorHandler);

module.exports = app;