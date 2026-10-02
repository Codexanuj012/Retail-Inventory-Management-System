/**
 * Standard Success Response
 */
const successResponse = (res, statusCode = 200, message = 'Success', data = null, meta = null) => {
  const responsePayload = {
    success: true,
    message,
    ...(data !== null && { data }),
    ...(meta !== null && { meta })
  };
  return res.status(statusCode).json(responsePayload);
};

/**
 * Standard Error Response
 */
const errorResponse = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
  const responsePayload = {
    success: false,
    message,
    ...(errors !== null && { errors })
  };
  return res.status(statusCode).json(responsePayload);
};

module.exports = {
  successResponse,
  errorResponse
};