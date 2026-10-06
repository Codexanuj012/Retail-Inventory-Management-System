const { pool } = require('../config/db');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Warehouse = require('../models/Warehouse');
const Inventory = require('../models/Inventory');
const StockMovement = require('../models/StockMovement');

class OrderService {
  static async createOrder(orderData, user_id) {
    const { order_type, warehouse_id, items } = orderData;

    const warehouse = await Warehouse.findById(warehouse_id);
    if (!warehouse) {
      const error = new Error('Selected warehouse does not exist.');
      error.statusCode = 400;
      throw error;
    }

    let calculatedTotal = 0;
    const validatedItems = [];

    // Pre-validation of products and inventory availability
    for (const item of items) {
      const product = await Product.findById(item.product_id);
      if (!product) {
        const error = new Error(`Product ID ${item.product_id} not found.`);
        error.statusCode = 404;
        throw error;
      }

      if (order_type === 'SALES') {
        const stock = await Inventory.findByProductAndWarehouse(item.product_id, warehouse_id);
        if (!stock || stock.quantity < item.quantity) {
          const error = new Error(`Insufficient stock for product "${product.name}" in selected warehouse.`);
          error.statusCode = 400;
          throw error;
        }
      }

      const itemTotal = Number(item.quantity) * Number(item.unit_price);
      calculatedTotal += itemTotal;

      validatedItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: itemTotal
      });
    }

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Create Order Master Record
      const orderId = await Order.createOrder({
        user_id,
        order_type,
        status: 'PENDING',
        total_amount: calculatedTotal
      }, connection);

      // Create Order Items & Adjust Inventory
      for (const item of validatedItems) {
        await Order.createOrderItem({
          order_id: orderId,
          ...item
        }, connection);

        // Deduct inventory for SALES orders, add inventory for PURCHASE orders
        const stockAdjustment = order_type === 'PURCHASE' ? item.quantity : -Math.abs(item.quantity);
        await Inventory.upsertStock(item.product_id, warehouse_id, stockAdjustment);

        // Record stock movement trace
        await StockMovement.create({
          product_id: item.product_id,
          warehouse_id,
          user_id,
          movement_type: order_type === 'PURCHASE' ? 'IN' : 'OUT',
          quantity: item.quantity,
          reference: `ORDER_#${orderId}`,
          notes: `${order_type} Order processing`
        }, connection);
      }

      await connection.commit();
      connection.release();

      return await Order.findById(orderId);
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  }

  static async getAllOrders(params) {
    const { page, limit, offset, order_type, status, user_id } = params;
    return await Order.findAll({ limit, offset, order_type, status, user_id });
  }

  static async getOrderById(id) {
    const order = await Order.findById(id);
    if (!order) {
      const error = new Error('Order not found.');
      error.statusCode = 404;
      throw error;
    }
    return order;
  }

  static async updateOrderStatus(id, status) {
    const order = await Order.findById(id);
    if (!order) {
      const error = new Error('Order not found.');
      error.statusCode = 404;
      throw error;
    }

    await Order.updateStatus(id, status);
    return await Order.findById(id);
  }
}

module.exports = OrderService;