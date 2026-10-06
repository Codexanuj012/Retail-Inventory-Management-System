const SupplierService = require('../services/supplierService');
const { successResponse } = require('../utils/response');
const { getPaginationParams, formatPaginatedResponse } = require('../utils/pagination');

class SupplierController {
  static async getAllSuppliers(req, res, next) {
    try {
      const { page, limit, offset } = getPaginationParams(req.query);
      const { search, is_active } = req.query;

      const { suppliers, total } = await SupplierService.getAllSuppliers({
        page,
        limit,
        offset,
        search,
        is_active
      });

      const paginatedData = formatPaginatedResponse(suppliers, total, page, limit);
      return successResponse(res, 200, 'Suppliers retrieved successfully', paginatedData.data, paginatedData.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getSupplierById(req, res, next) {
    try {
      const supplier = await SupplierService.getSupplierById(req.params.id);
      return successResponse(res, 200, 'Supplier details retrieved successfully', { supplier });
    } catch (error) {
      next(error);
    }
  }

  static async createSupplier(req, res, next) {
    try {
      const supplier = await SupplierService.createSupplier(req.body);
      return successResponse(res, 201, 'Supplier created successfully', { supplier });
    } catch (error) {
      next(error);
    }
  }

  static async updateSupplier(req, res, next) {
    try {
      const supplier = await SupplierService.updateSupplier(req.params.id, req.body);
      return successResponse(res, 200, 'Supplier updated successfully', { supplier });
    } catch (error) {
      next(error);
    }
  }

  static async deleteSupplier(req, res, next) {
    try {
      await SupplierService.deleteSupplier(req.params.id);
      return successResponse(res, 200, 'Supplier deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SupplierController;