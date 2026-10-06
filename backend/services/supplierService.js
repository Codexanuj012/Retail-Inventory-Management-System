const Supplier = require('../models/Supplier');

class SupplierService {
  static async getAllSuppliers(params) {
    const { page, limit, offset, search, is_active } = params;
    return await Supplier.findAll({ limit, offset, search, is_active });
  }

  static async getSupplierById(id) {
    const supplier = await Supplier.findById(id);
    if (!supplier) {
      const error = new Error('Supplier not found.');
      error.statusCode = 404;
      throw error;
    }
    return supplier;
  }

  static async createSupplier(supplierData) {
    if (supplierData.email) {
      const existingEmail = await Supplier.findByEmail(supplierData.email);
      if (existingEmail) {
        const error = new Error('Supplier with this email already exists.');
        error.statusCode = 400;
        throw error;
      }
    }

    const id = await Supplier.create(supplierData);
    return await Supplier.findById(id);
  }

  static async updateSupplier(id, supplierData) {
    const supplier = await Supplier.findById(id);
    if (!supplier) {
      const error = new Error('Supplier not found.');
      error.statusCode = 404;
      throw error;
    }

    await Supplier.update(id, {
      name: supplierData.name || supplier.name,
      contact_name: supplierData.contact_name !== undefined ? supplierData.contact_name : supplier.contact_name,
      email: supplierData.email !== undefined ? supplierData.email : supplier.email,
      phone: supplierData.phone !== undefined ? supplierData.phone : supplier.phone,
      address: supplierData.address !== undefined ? supplierData.address : supplier.address,
      is_active: supplierData.is_active !== undefined ? supplierData.is_active : supplier.is_active
    });

    return await Supplier.findById(id);
  }

  static async deleteSupplier(id) {
    const supplier = await Supplier.findById(id);
    if (!supplier) {
      const error = new Error('Supplier not found.');
      error.statusCode = 404;
      throw error;
    }

    return await Supplier.delete(id);
  }
}

module.exports = SupplierService;