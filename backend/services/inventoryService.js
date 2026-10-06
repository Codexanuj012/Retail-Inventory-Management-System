const Inventory = require('../models/Inventory');
const Product = require('../models/Product');
const Warehouse = require('../models/Warehouse');

class InventoryService {
  static async getInventoryList(params) {
    const { page, limit, offset, warehouse_id, product_id, low_stock } = params;
    return await Inventory.findAll({ limit, offset, warehouse_id, product_id, low_stock });
  }

  static async adjustStock(data) {
    const { product_id, warehouse_id, quantity, mode } = data; // mode: 'ADD' | 'SET'

    const product = await Product.findById(product_id);
    if (!product) {
      const error = new Error('Product not found.');
      error.statusCode = 404;
      throw error;
    }

    const warehouse = await Warehouse.findById(warehouse_id);
    if (!warehouse) {
      const error = new Error('Warehouse not found.');
      error.statusCode = 404;
      throw error;
    }

    if (mode === 'SET') {
      await Inventory.setStock(product_id, warehouse_id, quantity);
    } else {
      await Inventory.upsertStock(product_id, warehouse_id, quantity);
    }

    return await Inventory.findByProductAndWarehouse(product_id, warehouse_id);
  }
}

module.exports = InventoryService;