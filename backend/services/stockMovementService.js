const { pool } = require('../config/db');
const StockMovement = require('../models/StockMovement');
const Inventory = require('../models/Inventory');
const Product = require('../models/Product');
const Warehouse = require('../models/Warehouse');

class StockMovementService {
  static async recordMovement(data) {
    const { product_id, warehouse_id, user_id, movement_type, quantity, reference, notes } = data;

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

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      let stockAdjustment = quantity;
      if (movement_type === 'OUT') {
        stockAdjustment = -Math.abs(quantity);

        const currentStock = await Inventory.findByProductAndWarehouse(product_id, warehouse_id);
        if (!currentStock || currentStock.quantity < Math.abs(quantity)) {
          const error = new Error('Insufficient stock available for stock-out.');
          error.statusCode = 400;
          throw error;
        }
      } else if (movement_type === 'IN') {
        stockAdjustment = Math.abs(quantity);
      }

      await Inventory.upsertStock(product_id, warehouse_id, stockAdjustment);

      const movementId = await StockMovement.create({
        product_id,
        warehouse_id,
        user_id,
        movement_type,
        quantity: Math.abs(quantity),
        reference,
        notes
      }, connection);

      await connection.commit();
      connection.release();

      return await StockMovement.findById(movementId);
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  }

  static async transferStock(data) {
    const { product_id, source_warehouse_id, target_warehouse_id, user_id, quantity, reference, notes } = data;

    if (source_warehouse_id === target_warehouse_id) {
      const error = new Error('Source and target warehouses must be different.');
      error.statusCode = 400;
      throw error;
    }

    const currentStock = await Inventory.findByProductAndWarehouse(product_id, source_warehouse_id);
    if (!currentStock || currentStock.quantity < quantity) {
      const error = new Error('Insufficient stock in source warehouse.');
      error.statusCode = 400;
      throw error;
    }

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Deduct from source warehouse
      await Inventory.upsertStock(product_id, source_warehouse_id, -Math.abs(quantity));
      await StockMovement.create({
        product_id,
        warehouse_id: source_warehouse_id,
        user_id,
        movement_type: 'TRANSFER',
        quantity: Math.abs(quantity),
        reference,
        notes: `Transfer Out to Warehouse ID: ${target_warehouse_id}. ${notes || ''}`
      }, connection);

      // Add to target warehouse
      await Inventory.upsertStock(product_id, target_warehouse_id, Math.abs(quantity));
      await StockMovement.create({
        product_id,
        warehouse_id: target_warehouse_id,
        user_id,
        movement_type: 'TRANSFER',
        quantity: Math.abs(quantity),
        reference,
        notes: `Transfer In from Warehouse ID: ${source_warehouse_id}. ${notes || ''}`
      }, connection);

      await connection.commit();
      connection.release();

      return { message: 'Stock transferred successfully', quantity };
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  }

  static async getMovements(params) {
    const { page, limit, offset, product_id, warehouse_id, movement_type } = params;
    return await StockMovement.findAll({ limit, offset, product_id, warehouse_id, movement_type });
  }
}

module.exports = StockMovementService;