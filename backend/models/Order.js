const { pool } = require('../config/db');

class Order {
  static async createOrder(orderData, connection = pool) {
    const { user_id, order_type, status, total_amount } = orderData;
    const query = `
      INSERT INTO orders (user_id, order_type, status, total_amount)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await connection.execute(query, [
      user_id,
      order_type,
      status || 'PENDING',
      total_amount || 0.00
    ]);
    return result.insertId;
  }

  static async createOrderItem(itemData, connection = pool) {
    const { order_id, product_id, quantity, unit_price, total_price } = itemData;
    const query = `
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await connection.execute(query, [
      order_id,
      product_id,
      quantity,
      unit_price,
      total_price
    ]);
    return result.insertId;
  }

  static async findAll({ limit, offset, order_type, status, user_id }) {
    let whereConditions = [];
    let queryParams = [];

    if (order_type) {
      whereConditions.push('o.order_type = ?');
      queryParams.push(order_type);
    }

    if (status) {
      whereConditions.push('o.status = ?');
      queryParams.push(status);
    }

    if (user_id) {
      whereConditions.push('o.user_id = ?');
      queryParams.push(user_id);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*) as total FROM orders o ${whereClause}`;
    const [countRows] = await pool.execute(countQuery, queryParams);
    const total = countRows[0].total;

    const dataQuery = `
      SELECT 
        o.id, o.user_id, CONCAT(u.first_name, ' ', u.last_name) as created_by,
        o.order_type, o.status, o.total_amount, o.created_at, o.updated_at
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ${whereClause}
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?
    `;

    queryParams.push(String(limit), String(offset));
    const [rows] = await pool.query(dataQuery, queryParams);

    return { orders: rows, total };
  }

  static async findById(id) {
    const orderQuery = `
      SELECT 
        o.id, o.user_id, CONCAT(u.first_name, ' ', u.last_name) as created_by,
        o.order_type, o.status, o.total_amount, o.created_at, o.updated_at
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `;
    const [orderRows] = await pool.execute(orderQuery, [id]);
    if (!orderRows[0]) return null;

    const itemsQuery = `
      SELECT 
        oi.id, oi.product_id, p.name as product_name, p.sku,
        oi.quantity, oi.unit_price, oi.total_price
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `;
    const [itemRows] = await pool.execute(itemsQuery, [id]);

    return {
      ...orderRows[0],
      items: itemRows
    };
  }

  static async updateStatus(id, status, connection = pool) {
    const query = `UPDATE orders SET status = ? WHERE id = ?`;
    const [result] = await connection.execute(query, [status, id]);
    return result.affectedRows > 0;
  }
}

module.exports = Order;