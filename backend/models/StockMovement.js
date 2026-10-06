const { pool } = require('../config/db');

class StockMovement {
  static async create(movementData, connection = pool) {
    const { product_id, warehouse_id, user_id, movement_type, quantity, reference, notes } = movementData;
    const query = `
      INSERT INTO stock_movements (product_id, warehouse_id, user_id, movement_type, quantity, reference, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await connection.execute(query, [
      product_id,
      warehouse_id,
      user_id,
      movement_type,
      quantity,
      reference || null,
      notes || null
    ]);
    return result.insertId;
  }

  static async findAll({ limit, offset, product_id, warehouse_id, movement_type }) {
    let whereConditions = [];
    let queryParams = [];

    if (product_id) {
      whereConditions.push('sm.product_id = ?');
      queryParams.push(product_id);
    }

    if (warehouse_id) {
      whereConditions.push('sm.warehouse_id = ?');
      queryParams.push(warehouse_id);
    }

    if (movement_type) {
      whereConditions.push('sm.movement_type = ?');
      queryParams.push(movement_type);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*) as total FROM stock_movements sm ${whereClause}`;
    const [countRows] = await pool.execute(countQuery, queryParams);
    const total = countRows[0].total;

    const dataQuery = `
      SELECT 
        sm.id, sm.product_id, p.name as product_name, p.sku,
        sm.warehouse_id, w.name as warehouse_name,
        sm.user_id, CONCAT(u.first_name, ' ', u.last_name) as performed_by,
        sm.movement_type, sm.quantity, sm.reference, sm.notes, sm.created_at
      FROM stock_movements sm
      JOIN products p ON sm.product_id = p.id
      JOIN warehouses w ON sm.warehouse_id = w.id
      JOIN users u ON sm.user_id = u.id
      ${whereClause}
      ORDER BY sm.created_at DESC
      LIMIT ? OFFSET ?
    `;

    queryParams.push(String(limit), String(offset));
    const [rows] = await pool.query(dataQuery, queryParams);

    return { movements: rows, total };
  }

  static async findById(id) {
    const query = `
      SELECT 
        sm.id, sm.product_id, p.name as product_name, p.sku,
        sm.warehouse_id, w.name as warehouse_name,
        sm.user_id, CONCAT(u.first_name, ' ', u.last_name) as performed_by,
        sm.movement_type, sm.quantity, sm.reference, sm.notes, sm.created_at
      FROM stock_movements sm
      JOIN products p ON sm.product_id = p.id
      JOIN warehouses w ON sm.warehouse_id = w.id
      JOIN users u ON sm.user_id = u.id
      WHERE sm.id = ?
    `;
    const [rows] = await pool.execute(query, [id]);
    return rows[0] || null;
  }
}

module.exports = StockMovement;