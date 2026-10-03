const ProductService = require('../services/productService');
const { successResponse } = require('../utils/response');
const { getPaginationParams, formatPaginatedResponse } = require('../utils/pagination');

class ProductController {
  static async getAllProducts(req, res, next) {
    try {
      const { page, limit, offset } = getPaginationParams(req.query);
      const { search, category_id, supplier_id, is_active } = req.query;

      const { products, total } = await ProductService.getAllProducts({
        page,
        limit,
        offset,
        search,
        category_id,
        supplier_id,
        is_active
      });

      const paginatedData = formatPaginatedResponse(products, total, page, limit);
      return successResponse(res, 200, 'Products retrieved successfully', paginatedData.data, paginatedData.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getProductById(req, res, next) {
    try {
      const product = await ProductService.getProductById(req.params.id);
      return successResponse(res, 200, 'Product details retrieved successfully', { product });
    } catch (error) {
      next(error);
    }
  }

  static async createProduct(req, res, next) {
    try {
      const product = await ProductService.createProduct(req.body);
      return successResponse(res, 201, 'Product created successfully', { product });
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req, res, next) {
    try {
      const product = await ProductService.updateProduct(req.params.id, req.body);
      return successResponse(res, 200, 'Product updated successfully', { product });
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(req, res, next) {
    try {
      await ProductService.deleteProduct(req.params.id);
      return successResponse(res, 200, 'Product deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductController;