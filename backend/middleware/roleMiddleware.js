const { errorResponse } = require('../utils/response');

/**
 * Role-Based Access Control Middleware
 * @param  {...string|number} allowedRoles Allowed role IDs or Role Names
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 401, 'Unauthorized request.');
    }

    const { roleId, roleName } = req.user;

    const hasAccess = allowedRoles.some(
      (role) => role === roleId || role === roleName
    );

    if (!hasAccess) {
      return errorResponse(res, 403, 'Forbidden. You do not have permission to access this resource.');
    }

    next();
  };
};

module.exports = {
  authorizeRoles
};