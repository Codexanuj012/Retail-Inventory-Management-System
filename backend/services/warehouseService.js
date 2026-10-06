const Warehouse = require('../models/Warehouse');

class WarehouseService {
  static async getAllWarehouses() {
    return await Warehouse.findAll();
  }

  static async getWarehouseById(id) {
    const warehouse = await Warehouse.findById(id);
    if (!warehouse) {
      const error = new Error('Warehouse not found.');
      error.statusCode = 404;
      throw error;
    }
    return warehouse;
  }

  static async createWarehouse(warehouseData) {
    const existing = await Warehouse.findByName(warehouseData.name);
    if (existing) {
      const error = new Error('Warehouse name already exists.');
      error.statusCode = 400;
      throw error;
    }

    const id = await Warehouse.create(warehouseData);
    return await Warehouse.findById(id);
  }

  static async updateWarehouse(id, warehouseData) {
    const warehouse = await Warehouse.findById(id);
    if (!warehouse) {
      const error = new Error('Warehouse not found.');
      error.statusCode = 404;
      throw error;
    }

    await Warehouse.update(id, {
      name: warehouseData.name || warehouse.name,
      location: warehouseData.location !== undefined ? warehouseData.location : warehouse.location,
      is_active: warehouseData.is_active !== undefined ? warehouseData.is_active : warehouse.is_active
    });

    return await Warehouse.findById(id);
  }

  static async deleteWarehouse(id) {
    const warehouse = await Warehouse.findById(id);
    if (!warehouse) {
      const error = new Error('Warehouse not found.');
      error.statusCode = 404;
      throw error;
    }

    return await Warehouse.delete(id);
  }
}

module.exports = WarehouseService;