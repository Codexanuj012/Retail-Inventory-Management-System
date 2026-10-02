/**
 * Helper to parse pagination parameters from query string
 */
const getPaginationParams = (query, defaultLimit = 10, defaultPage = 1) => {
  const page = Math.max(1, parseInt(query.page, 10) || defaultPage);
  const limit = Math.max(1, Math.min(100, parseInt(query.limit, 10) || defaultLimit));
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

/**
 * Helper to structure paginated meta data
 */
const formatPaginatedResponse = (data, totalItems, page, limit) => {
  const totalPages = Math.ceil(totalItems / limit);
  return {
    data,
    meta: {
      totalItems,
      itemCount: data.length,
      itemsPerPage: limit,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  };
};

module.exports = {
  getPaginationParams,
  formatPaginatedResponse
};