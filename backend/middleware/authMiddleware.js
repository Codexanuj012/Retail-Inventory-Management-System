const { verifyToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/response');

/**
 * Protect routes - require valid JWT
 */
const authenticate = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return errorResponse(res, 401, 'Authentication failed. Token not provided.');
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return errorResponse(res, 401, 'Invalid or expired token.');
  }
};

module.exports = {
  authenticate
};