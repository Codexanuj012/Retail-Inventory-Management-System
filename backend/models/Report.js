const { pool } = require('../config/db');

class Report {
  static async getOverviewStats() {
    const query = `
      SELECT
        (SELECT COUNT(*) FROM products WHERE is_active = TRUE) AS total_products,
        (SELECT COUNT(*) FROM categories WHERE is_active = TRUE) AS total_categories,
        (SELECT COUNT(*) FROM warehouses WHERE is_active = TRUE) AS total_warehouses,
        (SELECT COUNT(*) FROM suppliers WHERE is_active = TRUE) AS total_suppliers,
        (SELECT COALESCE(SUM(quantity), 0) FROM inventory) AS total_inventory_items,
        (SELECT COUNT(*) FROM orders WHERE order_type = 'SALES' AND status = 'COMPLETED') AS total_sales_orders,
        (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE order_type = 'SALES' AND status = 'COMPLETED') AS total_revenue
    `;
    const [rows] = await pool.execute(query);
    return rows[0];
  }

  static async getLowStockAlerts(limit = 10) {
    const query = `
      SELECT 
        i.id AS inventory_id,
        p.id AS product_id,
        p.name AS product_name,
        p.sku,
        p.reorder_level,
        w.id AS warehouse_id,
        w.name AS warehouse_name,
        i.quantity
      FROM inventory i
      JOIN products p ON i.product_id = p.id
      JOIN warehouses w ON i.warehouse_id = w.id
      WHERE i.quantity <= p.reorder_level
      ORDER BY i.quantity ASC
      LIMIT ?
    `;
    const [rows] = await pool.query(query, [String(limit)]);
    return rows;
  }

  static async getRecentStockMovements(limit = 10) {
    const query = `
      SELECT 
        sm.id,
        p.name AS product_name,
        p.sku,
        w.name AS warehouse_name,
        CONCAT(u.first_name, ' ', u.last_name) AS performed_by,
        sm.movement_type,
        sm.quantity,
        sm.reference,
        sm.created_at
      FROM stock_movements sm
      JOIN products p ON sm.product_id = p.id
      JOIN warehouses w ON sm.warehouse_id = w.id
      JOIN users u ON sm.user_id = u.id
      ORDER BY sm.created_at DESC
      LIMIT ?
    `;
    const [rows] = await pool.query(query, [String(limit)]);
    return rows;
  }

  static async getRecentOrders(limit = 5) {
    const query = `
      SELECT 
        o.id,
        CONCAT(u.first_name, ' ', u.last_name) AS customer_or_creator,
        o.order_type,
        o.status,
        o.total_amount,
        o.created_at
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT ?
    `;
    const [rows] = await pool.query(query, [String(limit)]);
    return rows;
  }

  static async getInventoryValuation() {
    const query = `
      SELECT 
        p.id AS product_id,
        p.name AS product_name,
        p.sku,
        c.name AS category_name,
        COALESCE(SUM(i.quantity), 0) AS total_stock,
        p.cost_price,
        p.unit_price,
        (COALESCE(SUM(i.quantity), 0) * p.cost_price) AS total_cost_value,
        (COALESCE(SUM(i.quantity), 0) * p.unit_price) AS total_retail_value
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN inventory i ON p.id = i.product_id
      WHERE p.is_active = TRUE
      GROUP BY p.id, p.name, p.sku, c.name, p.cost_price, p.unit_price
      ORDER BY total_cost_value DESC
    `;
    const [rows] = await pool.execute(query);
    return rows;
  }

  static async getSalesReport({ startDate, endDate }) {
    let whereClause = "WHERE o.order_type = 'SALES' AND o.status = 'COMPLETED'";
    const queryParams = [];

    if (startDate) {
      whereClause += " AND o.created_at >= ?";
      queryParams.push(startDate);
    }
    if (endDate) {
      whereClause += " AND o.created_at <= ?";
      queryParams.push(endDate);
    }

    const query = `
      SELECT 
        o.id AS order_id,
        CONCAT(u.first_name, ' ', u.last_name) AS sales_rep,
        o.total_amount,
        o.created_at
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ${whereClause}
      ORDER BY o.created_at DESC
    `;
    const [rows] = await pool.execute(query, queryParams);
    return rows;
  }
}

module.exports = Report;